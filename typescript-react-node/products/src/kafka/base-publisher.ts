import { Kafka, Producer, Partitioners } from 'kafkajs';
import { Topics } from './types/topics';
import {
  ApplicationServerError,
  ApplicationIntegrityError,
} from '../types/error-types';

interface Event {
  topic: Topics;
  key: string;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract topic: T['topic'];
  protected client: Kafka;
  private _producer: Producer;
  private isConnected = false;

  constructor(client: Kafka) {
    console.log(`Creating Kafka Client...`);
    this.client = client;

    this._producer = this.client.producer({
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
      createPartitioner: Partitioners.DefaultPartitioner,
    });
    console.log(`Created Kafka Client`);
  }

  async connect() {
    console.log(`Connecting producer for topic ${this.topic}...`);
    try {
      await this._producer.connect();
      console.log(`Connected producer for topic ${this.topic}`);
      this.isConnected = true;
    } catch (error: any) {
      this.isConnected = false;
      console.error(
        `Error in connecting producer for topic ${this.topic}`,
        error
      );
      throw new ApplicationServerError(error.toString()); // Rethrow the error after logging
    }
  }

  async shutdown() {
    try {
      console.log(`Disconnecting producer for topic: ${this.topic}...`);
      await this._producer.disconnect();
      console.log(`Disconnected Producer for topic: ${this.topic}`);
    } catch (error: any) {
      console.error(
        `Error in disconnecting producer for topic: ${this.topic}`,
        error
      );
      throw new ApplicationServerError(error.toString()); // Rethrow the error after logging
    } finally {
      this.isConnected = false;
    }
  }

  async publish(key: string, data: T['data']): Promise<void> {
    if (!key) {
      throw new ApplicationIntegrityError(
        `Error publishing message on topic ${this.topic}: property key is empty`
      );
    }

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
    } catch (error: any) {
      console.error('Error in publishing message:', error);
      throw new ApplicationServerError(error.toString()); // Rethrow the error after logging
    }
  }
}
