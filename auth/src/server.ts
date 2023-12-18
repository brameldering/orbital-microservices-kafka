import mongoose from 'mongoose';
import { app } from './app';
import { kafkaWrapper, Topics, Publisher } from '@orbitelco/common';
import { ApiAccessCreatedPublisher } from './events/publishers/api-access-created-publisher';
import { ApiAccessUpdatedPublisher } from './events/publishers/api-access-updated-publisher';
import { ApiAccessDeletedPublisher } from './events/publishers/api-access-deleted-publisher';

const KAFKA_CLIENT_ID = 'auth';

const publisherConfigurations = [
  {
    topic: Topics.ApiAccessCreated,
    publisherClass: ApiAccessCreatedPublisher,
  },
  {
    topic: Topics.ApiAccessUpdated,
    publisherClass: ApiAccessUpdatedPublisher,
  },
  {
    topic: Topics.ApiAccessDeleted,
    publisherClass: ApiAccessDeletedPublisher,
  },
];

// Array to keep track of all listeners
const allPublishers: Publisher<any>[] = [];

const start = async () => {
  try {
    // Ensure Kafka connection
    await kafkaWrapper.connect(
      KAFKA_CLIENT_ID,
      process.env.KAFKA_BROKERS!.split(',')
    );

    // instantiate and connect all publishers
    for (const config of publisherConfigurations) {
      const publisher = new config.publisherClass(kafkaWrapper.client);
      await publisher.connect();
      allPublishers.push(publisher);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    // Start listening
    app.listen(3000, () => {
      console.log('Listening on port 3000');
    });

    // Handle graceful shutdown
    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);
  } catch (err) {
    console.log(err);
  }
};

const shutDown = async () => {
  console.log('Received stop signal, shutting down gracefully');

  try {
    // Disconnect all registered publishers
    for (const publisher of allPublishers) {
      await publisher.shutdown();
    }

    // Disconnect Kafka client and admin
    await kafkaWrapper.disconnect();
    console.log('Kafka client disconnected');

    // Disconnect MongoDB connection
    await mongoose.disconnect();
    console.log('MongoDB disconnected');

    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

start();
