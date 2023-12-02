import kafka from 'kafka-node';

const client = new kafka.KafkaClient({
  kafkaHost: 'localhost:9092',
});

client.on('ready', () => {
  console.log('Kafka Connected using kafka-node');
});

client.on('error', (error) => {
  console.error('Error connecting to Kafka:', error);
});

export default client;
