import kafka from 'kafka-node';
import client from './client-instance';

// Create consumers within the same consumer group
const createConsumer = (topic: string, CGid: string, ConsumerName: string) => {
  const consumerOptions = {
    groupId: CGid, // Consumer group ID
    autoCommit: true, // Enable auto-commit
    autoCommitIntervalMs: 5000, // Auto-commit interval (in ms)
    sessionTimeout: 15000, // Session timeout (in ms)
    fetchMaxBytes: 1024 * 1024, // Max fetch bytes
  };

  const consumer = new kafka.ConsumerGroup(
    Object.assign({ id: CGid }, consumerOptions),
    topic
  );

  consumer.on('message', (message) => {
    console.log(`Consumer ${ConsumerName} received message:`, message);
  });

  consumer.on('error', (error) => {
    console.error(`Consumer ${ConsumerName} error:`, error);
  });

  // Gracefully handle termination
  process.on('SIGINT', () => {
    consumer.close(true, () => {
      process.exit(0);
    });
  });
};

export default createConsumer;
