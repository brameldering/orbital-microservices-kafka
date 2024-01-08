if (!process.env.DEPLOY_ENV || process.env.DEPLOY_ENV !== 'kubernetes') {
  require('dotenv').config();
}
import mongoose from 'mongoose';
import {
  kafkaWrapper,
  getKafkaLogLevel,
  Topics,
  Listener,
  ListenerManager,
  IConsumerConfig,
  wait,
} from '@orbitelco/common';
import { SequenceResponseOrdersPublisher } from './events/publishers/sequence-response-orders-publisher';
import { SequenceResponseProductsPublisher } from './events/publishers/sequence-response-products-publisher';
import { SequenceRequestOrdersListener } from './events/listeners/sequence-request-orders-listener';
import { SequenceRequestProductsListener } from './events/listeners/sequence-request-products-listener';

class Server {
  private readonly KAFKA_CLIENT_ID = 'sequences';
  private readonly CONSUMER_GROUP = 'sequences';

  // ===================================================================
  private publisherConfigurations = [
    {
      topic: Topics.SequenceResponseOrders,
      publisherClass: SequenceResponseOrdersPublisher,
    },
    {
      topic: Topics.SequenceResponseProducts,
      publisherClass: SequenceResponseProductsPublisher,
    },
  ];

  // ===================================================================
  private listenerManager: ListenerManager | null = null;
  // Array to keep track of all listeners
  private allListeners: Listener<any>[] = [];
  private readonly listenerConfigurations = [
    {
      topic: Topics.SequenceRequestOrders,
      listenerClass: SequenceRequestOrdersListener,
    },
    {
      topic: Topics.SequenceRequestProducts,
      listenerClass: SequenceRequestProductsListener,
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
      // Check for existence of ENV variables set in depl files (dev/prod) or .env file for test
      if (!process.env.MONGO_URI) {
        console.error('Missing ENV variable for MONGO_URI');
        process.exit(1);
      }
      if (!process.env.KAFKA_BROKERS) {
        console.error('Missing ENV variable for KAFKA_BROKERS');
        process.exit(1);
      }
      if (!process.env.KAFKA_LOG_LEVEL) {
        console.error('Missing ENV variable for KAFKA_LOG_LEVEL');
        process.exit(1);
      }
      try {
        // test if KAFKA_LOG_LEVEL is a valid level
        getKafkaLogLevel(process.env.KAFKA_LOG_LEVEL);
      } catch (error: any) {
        console.error('ENV variable for KAFKA_LOG_LEVEL not valid', error);
      }
      // ======================================================

      // Ensure Kafka connection
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
        await wait(1200); // wait to give balancing time
      }

      // Start listening for registered listeners
      await this.listenerManager.listen();

      // ===================================================================
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URI!);
      console.log(`Connected to MongoDB`);
    } catch (error: any) {
      console.error(`Error starting sequences server`, error);
    }
  };

  shutDown = async () => {
    console.log('Received stop signal, shutting down gracefully');

    try {
      // Disconnect all registered publishers
      for (const publisher of Object.values(kafkaWrapper.publishers)) {
        await publisher.shutdown();
      }
    } catch (error: any) {
      console.error('Error during shutdown of publishers:', error);
    }
    try {
      // Disconnect listener
      if (this.listenerManager) {
        await this.listenerManager.disconnect();
      }
    } catch (error: any) {
      console.error('Error during disconnect of listenerManager:', error);
    }
    try {
      // Disconnect Kafka client and admin
      await kafkaWrapper.disconnect();
      console.log('Kafka client disconnected');
    } catch (error: any) {
      console.error('Error during disconnect of kafka client:', error);
    }
    try {
      // Disconnect MongoDB connection
      await mongoose.disconnect();
      console.log('MongoDB disconnected');

      process.exit(0);
    } catch (error: any) {
      console.error('Error during MongoDB disconnect:', error);
      process.exit(1);
    }
  };
}

const server = new Server();
server.start();

// Handle graceful shutdown
process.on('SIGTERM', server.shutDown);
process.on('SIGINT', server.shutDown);

process.on('uncaughtException', (err: any) => {
  console.error('Shutting down due to uncaught exception');
  console.error(`ERROR: ${err.stack}`);
  process.exit(1);
});

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('Shutting down the server due to Unhandled Promise rejection');
  console.error(`ERROR: ${err.stack}`);
  process.exit(1);
});
