import kafka from 'kafka-node';

const client = new kafka.KafkaClient({
  kafkaHost: 'localhost:9092',
});

const consumer = new kafka.Consumer(client, [{ topic: 'snoozy' }], {});

consumer.on('message', (message) => {
  console.log('Received message:', message);
});

consumer.on('error', (error) => {
  console.error('Error in Kafka consumer:', error);
});
