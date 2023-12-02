import kafka from 'kafka-node';
import client from './client-instance';

const producerOptions = {
  // Configuration for when to consider a message as acknowledged, default 1
  requireAcks: -1, // 0 = no ack, 1 = leader ack, -1 = all: leader & replicas ack
  // The amount of time in milliseconds to wait for all acks before considered, default 100ms
  ackTimeoutMs: 3000,
  // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
  partitionerType: 3,
};

const producer = new kafka.Producer(client, producerOptions);

producer.on('ready', () => {
  console.log('Producer ready');
});

producer.on('error', (error) => {
  console.error('Error connecting to Kafka:', error);
});

process.on('SIGINT', () => {
  producer.close(() => {
    process.exit(0);
  });
});

export default producer;
