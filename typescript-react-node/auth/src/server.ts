import mongoose from 'mongoose';
import { app, setupApp } from './app';
import { kafkaWrapper, Topics, wait } from '@orbital_app/common';
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
      // Add publisher to kafkaWrapper instance
      kafkaWrapper.publishers[config.topic] = publisher;
      await wait(300); // wait to give balancing time
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log(`Connected to MongoDB`);

    // Setup App including caching of ApiAccess after mongoose connection has been established
    await setupApp();

    // Start listening
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error: any) {
    console.error(`Error starting auth server`, error);
  }
};

const shutDown = async () => {
  console.log('Received stop signal, shutting down gracefully');

  try {
    // Disconnect all registered publishers
    for (const publisher of Object.values(kafkaWrapper.publishers)) {
      await publisher.shutdown();
    }
  } catch (err) {
    console.error('Error during shutdown of publishers:', err);
  }
  try {
    // Disconnect Kafka client and admin
    await kafkaWrapper.disconnect();
    console.log('Kafka client disconnected');
  } catch (err) {
    console.error('Error during disconnect of kafka client:', err);
  }
  try {
    // Disconnect MongoDB connection
    await mongoose.disconnect();
    console.log('MongoDB disconnected');

    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB disconnect:', err);
    process.exit(1);
  }
};

start();

// Handle graceful shutdown
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
