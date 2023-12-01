import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'juno',
  brokers: ['localhost:9092'], // Replace with your Kafka broker addresses
  connectionTimeout: 5000,
});

const consumer = kafka.consumer({ groupId: 'my-group' });

async function connectToKafka() {
  await consumer.connect();
  console.log('Connected to Kafka');
}

connectToKafka();

async function consumeMessages() {
  await consumer.subscribe({ topic: 'snoozy' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (message !== null && message.value) {
        console.log({
          value: message.value.toString(),
        });
      }
    },
  });
}

// consumeMessages();
