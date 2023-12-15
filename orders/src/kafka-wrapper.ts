import { Kafka, logLevel } from 'kafkajs';

class KafkaWrapper {
  private _client?: Kafka;

  get client() {
    if (!this._client) {
      throw new Error('Cannot access Kafka client before connecting');
    }
    return this._client;
  }

  connect(clientId: string, brokers: string[]) {
    this._client = new Kafka({ clientId, brokers, logLevel: logLevel.ERROR });
    console.log('Created client for Kafka brokers', brokers);
  }
}

export const kafkaWrapper = new KafkaWrapper();
