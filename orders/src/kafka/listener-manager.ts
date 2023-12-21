import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { Listener } from './base-listener';
import { IConsumerConfig } from './types/consumer-config';
import { Topics } from '@orbitelco/common';

export class ListenerManager {
  private consumer: Consumer;
  private listeners: Map<string, Listener<any>> = new Map();
  private isConsumerConnected: boolean = false;
  // Map with topic enum values as keys and booleans as values to keep track of consumer subscribed to topic
  private isConsumerSubscribedToTopic = new Map<Topics, boolean>();
  private isConsumerListening: boolean = false;

  constructor(
    protected client: Kafka,
    protected CGID: string, // consumerGroupID
    protected consumerConfig: IConsumerConfig
  ) {
    // Initialize the map with default values
    Object.values(Topics).forEach((topic) => {
      this.isConsumerSubscribedToTopic.set(topic, false);
    });
    this.consumer = client.consumer({
      groupId: CGID,
      ...consumerConfig,
    });
    console.log(`Created consumer for CG ${CGID}`);
  }

  private isSubscribedToTopic(topic: Topics): boolean {
    const isSubscribed = this.isConsumerSubscribedToTopic.get(topic);
    return isSubscribed !== undefined ? isSubscribed : false;
  }

  async connect() {
    const method = 'ListenerManager.connect';
    try {
      console.log(`${method}: Connecting consumer for CG ${this.CGID}`);
      if (this.isConsumerConnected) {
        console.log(`${method}: Consumer is already connected`);
      } else {
        await this.consumer.connect();
        this.isConsumerConnected = true;
        console.log(`${method}: Connected consumer for CG ${this.CGID}`);
      }
    } catch (error) {
      console.error(`${method}: Error connecting consumer ${this.CGID}`, error);
      this.disconnect(); // Disconnect consumer
    }
  }

  async disconnect() {
    const method = 'ListenerManager.disconnect';
    try {
      console.log(`${method}: Disconnecting consumer for CG ${this.CGID}`);
      if (!this.isConsumerConnected) {
        console.log(`${method}: Consumer is already disconnected`);
      } else {
        await this.consumer.disconnect();
        this.isConsumerConnected = false;
        console.log(`${method}: Disconnected consumer for CG ${this.CGID}`);
      }
    } catch (error) {
      console.error(
        `${method}: Error disconnecting consumer for CG ${this.CGID}`,
        error
      );
    }
  }

  async registerListener(listener: Listener<any>) {
    const method = 'ListenerManager.registerListener';
    try {
      console.log(
        `${method}: Subscribing consumer to topic ${listener.topic} and CG ${this.CGID}`
      );
      if (this.isSubscribedToTopic(listener.topic)) {
        console.log(
          `${method}: Consumer is already subscribed to topic ${listener.topic} and CG ${this.CGID}`
        );
      } else {
        this.listeners.set(listener.topic, listener);
        await this.consumer.subscribe({
          topic: listener.topic,
          fromBeginning: true,
        });
        this.isConsumerSubscribedToTopic.set(listener.topic, true);
        console.log(
          `${method}: Subscribed consumer to topic ${listener.topic} and CG ${this.CGID}`
        );
      }
    } catch (error) {
      console.error(
        `${method}: Error subscribing consumer for topic ${listener.topic} and CG ${this.CGID}`,
        error
      );
      this.disconnect(); // Disconnect consumer
    }
  }

  async listen() {
    const method = 'ListenerManager.listen';
    try {
      console.log(`${method}: Consumer start listening CG ${this.CGID}`);
      if (this.isConsumerListening) {
        console.log(`${method}: Consumer is already listening`);
      } else {
        this.isConsumerListening = true;
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
                `Received message for CG: ${this.CGID}, topic: ${topic}, partition: ${partition}, offset: ${message.offset} - data:`,
                parsedData
              );
              await listener.onMessage(parsedData);
            }
          },
        });
      }
    } catch (error) {
      console.error(
        `Error start listening consumer for CG ${this.CGID}`,
        error
      );
      this.disconnect(); // Disconnect consumer
      this.isConsumerListening = false;
    }
    // Do not ues the following because it can cause a loop of many calls to listen
    // this.listen().catch(async (error) => {
    //   console.error('=> Error in Kafka consumer for CG: ${this.CGID}:', error);
    // });

    this.consumer.on('consumer.crash', ({ payload }) => {
      console.error(`=> consumer.crash in CG: ${this.CGID}:`, payload.error);
    });
  }
}
