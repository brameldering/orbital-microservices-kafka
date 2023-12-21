import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { Topics } from './types/topics';
import { IConsumerConfig } from './types/consumer-config';

interface Event {
  topic: Topics;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract topic: T['topic'];
  abstract onMessage(data: T['data']): void;
  private _consumer: Consumer;

  constructor(
    protected client: Kafka,
    protected consumerGroupID: string,
    protected consumerConfig: IConsumerConfig
  ) {
    this._consumer = this.client.consumer({
      groupId: this.consumerGroupID,
      ...consumerConfig,
    });
    console.log(`Created consumer for CG ${this.consumerGroupID}`);
  }

  async initialize() {
    try {
      await this._consumer.connect();
      console.log(`Connected consumer for CG ${this.consumerGroupID}`);
    } catch (error) {
      console.error(
        `Error connecting consumer for CG ${this.consumerGroupID}`,
        error
      );
    }
  }

  async shutdown() {
    console.log(
      `Shutting down consumer for topic ${this.topic} and CG ${this.consumerGroupID}`
    );
    try {
      await this._consumer.disconnect();
      console.log(
        `Disconnected consumer for topic ${this.topic} and CG ${this.consumerGroupID}`
      );
    } catch (error) {
      console.error(
        `Error disconnecting consumer for topic ${this.topic} and CG ${this.consumerGroupID}`,
        error
      );
    }
  }

  async listen() {
    try {
      await this._consumer.subscribe({
        topic: this.topic,
        fromBeginning: true,
      });
      console.log(
        `Subscribed consumer to topic ${this.topic} and CG ${this.consumerGroupID}`
      );
    } catch (error) {
      console.error(
        `Error subscribing consumer for topic ${this.topic} and CG ${this.consumerGroupID}`,
        error
      );
    }

    await this._consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        const parsedData = this.parseMessage(message);
        console.log(
          `Received message for CG: ${this.consumerGroupID}, topic: ${topic}, partition: ${partition}, offset: ${message.offset} - data:`,
          parsedData
        );
        this.onMessage(parsedData);
      },
    });

    this._consumer.on('consumer.crash', ({ payload }) => {
      console.error(
        `Error in CG: ${this.consumerGroupID}, topic: ${this.topic}:`,
        payload.error
      );
    });
  }

  parseMessage(message: { value: Buffer | null }) {
    const data = message.value;
    return data ? JSON.parse(data.toString()) : null;
  }
}
