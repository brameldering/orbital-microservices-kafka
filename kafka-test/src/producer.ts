import kafka from 'kafka-node';

console.clear();

const client = new kafka.KafkaClient({
  kafkaHost: 'localhost:9092',
});

client.on('ready', () => {
  console.log('Kafka Connected using kafka-node');
});

client.on('error', (error) => {
  console.error('Error connecting to Kafka:', error);
});

const producer = new kafka.Producer(client);

producer.on('ready', () => {
  console.log('Producer ready');
});

producer.on('error', (error) => {
  console.error('Error connecting to Kafka:', error);
});

const payload = [
  {
    topic: 'snoozy',
    messages: JSON.stringify({
      id: 123,
      name: 'user1',
      email: 'user1@test.com',
    }),
  },
];

producer.send(payload, (error, data) => {
  if (error) {
    console.error('Error in publishing message:', error);
  } else {
    console.log('Message successfully published:', data);
  }
});
