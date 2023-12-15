import kafka, { KafkaClient } from 'kafka-node';
// import { Topics } from '@orbitelco/common';

// const topic: Topics.ApiAccessCreated = Topics.ApiAccessCreated;

class KafkaWrapper {
  private _client?: KafkaClient;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access Kafka client before connecting');
    }
    return this._client;
  }

  // connect(clusterId: string, clientId: string, url: string) {
  connect(url: string) {
    this._client = new kafka.KafkaClient({
      kafkaHost: url,
    });
    console.log('connect');
    return new Promise<void>((resolve, reject) => {
      this.client.on('ready', () => {
        console.log('= KafkaWrapper on ready = Connected to Kafka');
        // const apiAccessCreatedTopic = [
        //   {
        //     topic: topic,
        //     partitions: 1,
        //     replicationFactor: 1,
        //   },
        // ];
        // this.client.createTopics(apiAccessCreatedTopic, () => {
        //   console.log(
        //     '= kafkawrapper - auth - createTopics apiAccessCreatedTopic'
        //   );
        // });
        resolve();
      });
      this.client.on('error', (error) => {
        console.error('= KafkaWrapper = Error connecting to Kafka:', error);
        reject(error);
      });
    });
  }
}

export const kafkaWrapper = new KafkaWrapper();
