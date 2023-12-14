import kafka, { KafkaClient, Producer } from 'kafka-node';
import { Topics } from './topics';

interface Event {
  topic: Topics;
  data: any;
}

const producerOptions = {
  // Configuration for when to consider a message as acknowledged, default 1
  requireAcks: -1, // 0 = no ack, 1 = leader ack, -1 = all: leader & replicas ack
  // The amount of time in milliseconds to wait for all acks before considered, default 100ms
  ackTimeoutMs: 3000,
  // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
  partitionerType: 3,
};

export abstract class Publisher<T extends Event> {
  abstract topic: T['topic'];
  protected client: KafkaClient;
  private _producer: Producer;

  constructor(client: KafkaClient) {
    this.client = client;
    this._producer = new kafka.Producer(client, producerOptions);
  }

  publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      const key = data.id;
      const payload = [
        {
          topic: this.topic,
          // partition,
          messages: new kafka.KeyedMessage(key, JSON.stringify(data)),
        },
      ];
      this._producer.send(payload, (error, data) => {
        if (error) {
          console.error('= Publisher = Error in publishing message:', error);
          return reject(error);
        } else {
          console.log(
            `= Publisher = Message successfully published on topic: ${this.topic}`,
            data
          );
          resolve();
        }
      });
      this._producer.on('ready', () => {
        console.log('= Publisher = Producer ready');
      });

      this._producer.on('error', (error) => {
        console.error('= Publisher = Error connecting to Kafka:', error);
      });

      process.on('SIGINT', () => {
        this._producer.close(() => {
          process.exit(0);
        });
      });
    });
  }
}
