import kafka from 'kafka-node';
import client from './client-instance';

const consumer = new kafka.Consumer(client, [{ topic: 'users' }], {});

consumer.on('message', (message) => {
  console.log('Received message:', message);
});

consumer.on('error', (error) => {
  console.error('Error in Kafka consumer:', error);
});
