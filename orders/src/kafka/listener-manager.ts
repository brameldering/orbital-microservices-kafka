import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { Listener } from './base-listener';
import { IConsumerConfig } from './types/consumer-config';

export class ListenerManager {
  private consumer: Consumer;
  private listeners: Map<string, Listener<any>> = new Map();

  constructor(
    protected client: Kafka,
    protected consumerGroupID: string,
    protected consumerConfig: IConsumerConfig
  ) {
    this.consumer = client.consumer({
      groupId: consumerGroupID,
      ...consumerConfig,
    });
    console.log(`Created consumer for CG ${consumerGroupID}`);
  }

  async connect() {
    try {
      await this.consumer.connect();
      console.log(`Connected consumer for CG ${this.consumerGroupID}`);
    } catch (error) {
      console.error(
        `Error connecting consumer for CG ${this.consumerGroupID}`,
        error
      );
    }
  }

  async disconnect() {
    console.log(`Disconnecting consumer for CG ${this.consumerGroupID}`);
    try {
      await this.consumer.disconnect();
      console.log(`Disconnected consumer for CG ${this.consumerGroupID}`);
    } catch (error) {
      console.error(
        `Error disconnecting consumer for CG ${this.consumerGroupID}`,
        error
      );
    }
  }

  async registerListener(listener: Listener<any>) {
    try {
      this.listeners.set(listener.topic, listener);
      // Subscribe the consumer to the topic
      await this.consumer.subscribe({
        topic: listener.topic,
        fromBeginning: true,
      });
      console.log(
        `Subscribed consumer to topic ${listener.topic} and CG ${this.consumerGroupID}`
      );
    } catch (error) {
      console.error(
        `Error subscribing consumer for topic ${listener.topic} and CG ${this.consumerGroupID}`,
        error
      );
    }
  }

  async listen() {
    await this.consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        const listener = this.listeners.get(topic);
        if (listener) {
          const parsedData = listener.parseMessage(message);
          console.log(
            `Received message for CG: ${this.consumerGroupID}, topic: ${topic}, partition: ${partition}, offset: ${message.offset} - data:`,
            parsedData
          );
          await listener.onMessage(parsedData);
        }
      },
    });

    this.listen().catch(async (error) => {
      console.error(
        '=> Error in Kafka consumer for CG: ${this.consumerGroupID}:',
        error
      );
    });

    this.consumer.on('consumer.crash', ({ payload }) => {
      console.error(
        `=> consumer.crash in CG: ${this.consumerGroupID}:`,
        payload.error
      );
    });
  }
}
