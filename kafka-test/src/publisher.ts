import { Kafka, Producer, ProducerRecord, Partitioners } from 'kafkajs';

// Create a Kafka client
const kafka = new Kafka({
  clientId: 'juno',
  brokers: ['localhost:9092'], // Replace with your Kafka broker addresses
});

// Create a producer instance
const producer: Producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});

// Connect to the Kafka cluster and produce messages after connection
async function connectAndProduce(): Promise<void> {
  try {
    await producer.connect();
    console.log('Connected to Kafka');

    const myTopic = 'snoozy';
    const messagesToSend = [
      'Paper planes',
      'Bad girls',
      'Rhyme the rhyme well',
    ];

    await produceMessages(myTopic, messagesToSend);
  } catch (error: any) {
    console.error('Error:', error);
  }
}

// Example function to send messages to a Kafka topic
async function produceMessages(
  topic: string,
  messages: string[]
): Promise<void> {
  try {
    const producerRecords: ProducerRecord[] = messages.map((message) => ({
      topic,
      messages: [{ value: message }],
    }));
    await producer.sendBatch({
      topicMessages: producerRecords,
    });
    console.log('Messages sent successfully!');
  } catch (error: any) {
    console.error('Error producing messages:', error);
  }
}

// Initiate the connection and message production
connectAndProduce();
