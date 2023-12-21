import { Kafka, Admin } from 'kafkajs';
import { Publisher, getKafkaLogLevel } from '@orbitelco/common';

class KafkaWrapper {
  private _client?: Kafka;
  private _clientId?: string;
  private _admin?: Admin;
  private _publishers: { [topic: string]: Publisher<any> } = {};

  get client() {
    if (!this._client) {
      throw new Error(
        'Cannot get client, use the kafkaWrapper.connect() method first before get client'
      );
    }
    return this._client;
  }

  get admin() {
    if (!this._admin) {
      throw new Error(
        'Cannot get admin, use the kafkaWrapper.connect() method first before get admin'
      );
    }
    return this._admin;
  }

  async connect(clientId: string, brokers: string[]) {
    try {
      const loglevel: number = getKafkaLogLevel(process.env.KAFKA_LOG_LEVEL!);
      // Initialize kafka client
      this._client = new Kafka({ clientId, brokers, logLevel: loglevel });
      this._clientId = clientId;
      console.log('Created client for Kafka brokers', brokers);
    } catch (error) {
      console.error(`Error creating client for brokers ${brokers}`, error);
      throw error;
    }
    try {
      // initialize kafka admin
      this._admin = this._client.admin();
      await this._admin.connect();
      console.log('Connected to kafka admin');
    } catch (error) {
      console.error(`Error connecting admin for brokers ${brokers}`, error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this._admin) {
        console.log('Disconnecting Kafka admin client');
        await this._admin.disconnect();
        this._admin = undefined;
      }

      if (this._client) {
        console.log('Invalidating Kafka client');
        // await this._client.disconnect();
        this._client = undefined;
      }

      console.log('Kafka client and admin disconnected successfully');
    } catch (error) {
      console.error('Error while disconnecting Kafka client and admin:', error);
      throw error;
    }
  }

  // Getter to get access to publishers object
  get publishers(): { [topic: string]: Publisher<any> } {
    // console.log('kafkaWrapper.get publishers', this._publishers);
    return this._publishers;
  }

  async ensureTopicExists(
    topicToCheck: string,
    numPartitions: number,
    replicationFactor: number
  ) {
    if (!this._client) {
      throw new Error(
        'KafkaWrapper: Cannot use ensureTopicExists before using kafkaWrapper.connect(...)'
      );
    }
    try {
      // check if topic is in list of existing topics
      const existingTopics = await this.admin.listTopics();
      if (!existingTopics.includes(topicToCheck)) {
        // Create topic
        await this.admin.createTopics({
          topics: [
            {
              topic: topicToCheck,
              numPartitions,
              replicationFactor,
              configEntries: [
                { name: 'cleanup.policy', value: 'compact' },
                { name: 'compression.type', value: 'gzip' },
              ],
            },
          ],
          timeout: 10000,
          waitForLeaders: true, // Wait for topic leaders to be elected
        });
        console.log(
          `Kafka client ${this._clientId} created topic: ${topicToCheck}`
        );
      } else {
        console.log(
          `Kafka client ${this._clientId} found topic: ${topicToCheck} already exists`
        );
      }
    } catch (error) {
      console.error(
        `Kafka client ${this._clientId} failed to ensure topic: ${topicToCheck}:`,
        error
      );
      throw error;
    }
  }
}

export const kafkaWrapper = new KafkaWrapper();
