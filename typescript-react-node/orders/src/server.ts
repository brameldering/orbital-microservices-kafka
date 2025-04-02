import mongoose from 'mongoose';
import { app, setupApp } from './app';
import { kafkaWrapper } from './kafka/kafka-wrapper';
import { Listener } from './kafka/base-listener';
import { ListenerManager } from './kafka/listener-manager';
import { Topics } from './kafka/types/topics';
import { IConsumerConfig } from './kafka/types/consumer-config';
import { wait } from "./utils/wait";

import { SequenceRequestOrdersPublisher } from './events/publishers/sequence-request-orders-publisher';
import { SequenceResponseOrdersListener } from './events/listeners/sequence-response-orders-listener';

class Server {
  private readonly KAFKA_CLIENT_ID = 'orders';
  private readonly CONSUMER_GROUP = 'orders';

  // ===================================================================
  private publisherConfigurations = [
    {
      topic: Topics.SequenceRequestOrders,
      publisherClass: SequenceRequestOrdersPublisher,
    },
  ];

  // ===================================================================
  private listenerManager: ListenerManager | null = null;
  // Array to keep track of all listeners
  private allListeners: Listener<any>[] = [];
  private readonly listenerConfigurations = [
    {
      topic: Topics.SequenceResponseOrders,
      listenerClass: SequenceResponseOrdersListener,
    },
  ];
  private readonly listenerConfig: IConsumerConfig = {
    sessionTimeout: 60000,
    rebalanceTimeout: 30000,
    heartbeatInterval: 3000,
    allowAutoTopicCreation: true,
  };

  // ===================================================================
  start = async () => {
    try {
      // Create Kafka connection
      await kafkaWrapper.connect(
        this.KAFKA_CLIENT_ID,
        process.env.KAFKA_BROKERS!.split(',')
      );

      // ===================================================================
      // instantiate publishers
      for (const config of this.publisherConfigurations) {
        const publisher = new config.publisherClass(kafkaWrapper.client);
        await publisher.connect();
        // Add publisher to kafkaWrapper instance
        kafkaWrapper.publishers[config.topic] = publisher;
        await wait(300); // wait to give balancing time
      }

      // ===================================================================
      // Instantiate listeners
      this.listenerManager = new ListenerManager(
        kafkaWrapper.client,
        this.CONSUMER_GROUP,
        this.listenerConfig
      );
      await this.listenerManager.connect();

      for (const config of this.listenerConfigurations) {
        const listener = new config.listenerClass();
        await this.listenerManager.registerListener(listener);
        this.allListeners.push(listener);
        await wait(500); // wait to give balancing time
      }

      // Start listening for registered listeners
      await this.listenerManager.listen();

      // ===================================================================
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URI!);
      console.log('Connected to MongoDB');

      // Setup App including caching of ApiAccess after mongoose connection has been established
      await setupApp();

      // Start listening
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Listening on port ${port}`);
      });
    } catch (error: any) {
      console.error(`Error starting orders server`, error);
    }
  };

  shutDown = async () => {
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
      // Disconnect listener
      if (this.listenerManager) {
        await this.listenerManager.disconnect();
      }
    } catch (err) {
      console.error('Error during disconnect of listenerManager:', err);
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
    }
  };
}

const server = new Server();
server.start();

// Handle graceful shutdown
process.on('SIGTERM', () => server.shutDown());
process.on('SIGINT', () => server.shutDown());

process.on('uncaughtException', (err: any) => {
  console.error('Shutting down due to uncaught exception');
  console.error(`ERROR: ${err.stack}`);
  server.shutDown();
  process.exit(1);
});

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('Shutting down the server due to Unhandled Promise rejection');
  console.error(`ERROR: ${err.stack}`);
  server.shutDown();
  process.exit(1);
});
