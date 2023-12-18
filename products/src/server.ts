import mongoose from 'mongoose';
import { app } from './app';
import { kafkaWrapper, Topics, Listener } from '@orbitelco/common';
import { ApiAccessCreatedListener } from './events/listeners/api-access-created-listener';
import { ApiAccessUpdatedListener } from './events/listeners/api-access-updated-listener';
import { ApiAccessDeletedListener } from './events/listeners/api-access-deleted-listener';

const KAFKA_CLIENT_ID = 'products';

const listenerConfigurations = [
  {
    topic: Topics.ApiAccessCreated,
    listenerClass: ApiAccessCreatedListener,
    consumerGroupID:
      'ConsumerGroup_' + KAFKA_CLIENT_ID + '_' + Topics.ApiAccessCreated,
  },
  {
    topic: Topics.ApiAccessUpdated,
    listenerClass: ApiAccessUpdatedListener,
    consumerGroupID:
      'ConsumerGroup_' + KAFKA_CLIENT_ID + '_' + Topics.ApiAccessUpdated,
  },
  {
    topic: Topics.ApiAccessDeleted,
    listenerClass: ApiAccessDeletedListener,
    consumerGroupID:
      'ConsumerGroup_' + KAFKA_CLIENT_ID + '_' + Topics.ApiAccessDeleted,
  },
];

// Array to keep track of all listeners
const allListeners: Listener<any>[] = [];

const start = async () => {
  try {
    // Create Kafka connection
    await kafkaWrapper.connect(
      KAFKA_CLIENT_ID,
      process.env.KAFKA_BROKERS!.split(',')
    );

    for (const config of listenerConfigurations) {
      const listener = new config.listenerClass(kafkaWrapper.client);
      listener.listen();
      allListeners.push(listener);
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
    // Disconnect all registered listeners
    for (const listener of allListeners) {
      await listener.shutdown();
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
