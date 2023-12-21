import { Kafka, Producer } from 'kafkajs';
import { Topics } from './types/topics';

interface Event {
  topic: Topics;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract topic: T['topic'];
  protected client: Kafka;
  private _producer: Producer;
  private isConnected = false;

  constructor(client: Kafka) {
    // constructor(clientId: string, brokers: string[]) {
    // this.client = new Kafka({ clientId, brokers, logLevel: logLevel.ERROR });
    this.client = client;

    this._producer = this.client.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
    });
  }

  async connect() {
    try {
      await this._producer.connect();
      console.log(`Producer connected for topic ${this.topic}`);
      this.isConnected = true;
    } catch (error) {
      this.isConnected = false;
      console.error(
        `Error in connecting producer for topic ${this.topic}`,
        error
      );
      throw error; // Rethrow the error after logging
    }
  }

  async shutdown() {
    try {
      console.log(`Disconnecting producer for topic: ${this.topic}`);
      await this._producer.disconnect();
      console.log(`Producer disconnected for topic: ${this.topic}`);
    } catch (error) {
      console.error(
        `Error in disconnecting producer for topic: ${this.topic}`,
        error
      );
      throw error; // Rethrow the error after logging
    } finally {
      this.isConnected = false;
    }
  }

  async publish(data: T['data']): Promise<void> {
    const key = data.id;

    try {
      if (!this.isConnected) {
        console.log('Producer is not yet connected, trying to connect now...');
        await this.connect();
      }
      await this._producer.send({
        topic: this.topic,
        acks: 1,
        messages: [{ key, value: JSON.stringify(data) }],
      });
      console.log(
        `Published message on topic: ${this.topic} with key ${key}`,
        data
      );
    } catch (error) {
      console.error('Error in publishing message:', error);
      throw error; // Rethrow the error after logging
    }
  }
}
