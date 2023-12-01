import kafka from 'kafka-node';

const user = new kafka.KafkaClient({
  kafkaHost: 'localhost:9092',
});

user.on('ready', () => {
  console.log('Kafka Connected using kafka-node');
});

user.on('error', (error) => {
  console.error('Error connecting to Kafka:', error);
});

const producer = new kafka.Producer(user);

producer.on('ready', () => {
  console.log('Producer Ready');
  const payload = [
    {
      topic: 'snoozy',
      messages: 'Hello!',
    },
  ];
  producer.send(payload, (error, data) => {
    console.log('in callback');
    if (error) {
      console.error('Error in publishing message:', error);
    } else {
      console.log('Message successfully published:', data);
    }
  });
});

producer.on('error', (error) => {
  console.error('Error connecting to Kafka:', error);
});
