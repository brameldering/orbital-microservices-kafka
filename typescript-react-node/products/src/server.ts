import mongoose from 'mongoose';
import { app, setupApp } from './app';
import {
  kafkaWrapper,
  Topics,
  Listener,
  ListenerManager,
  IConsumerConfig,
  wait,
} from '@orbital_app/common';
import { ApiAccessCreatedListener } from './events/listeners/api-access-created-listener';
import { ApiAccessUpdatedListener } from './events/listeners/api-access-updated-listener';
import { ApiAccessDeletedListener } from './events/listeners/api-access-deleted-listener';
import { SequenceRequestProductsPublisher } from './events/publishers/sequence-request-products-publisher';
import { SequenceResponseProductsListener } from './events/listeners/sequence-response-products-listener';
import { ProductCreatedPublisher } from './events/publishers/product-created-publisher';
import { ProductUpdatedPublisher } from './events/publishers/product-updated-publisher';
import { ProductDeletedPublisher } from './events/publishers/product-deleted-publisher';
import { InventoryUpdatedListener } from './events/listeners/inventory-updated-listener';

class Server {
  private readonly KAFKA_CLIENT_ID = 'products';
  private readonly CONSUMER_GROUP = 'products';
  private _isShuttingDown: boolean = false;

  // ===================================================================
  private publisherConfigurations = [
    {
      topic: Topics.SequenceRequestProducts,
      publisherClass: SequenceRequestProductsPublisher,
    },
    {
      topic: Topics.ProductCreated,
      publisherClass: ProductCreatedPublisher,
    },
    {
      topic: Topics.ProductUpdated,
      publisherClass: ProductUpdatedPublisher,
    },
    {
      topic: Topics.ProductDeleted,
      publisherClass: ProductDeletedPublisher,
    },
  ];

  // ===================================================================
  private listenerManager: ListenerManager | null = null;
  // Array to keep track of all listeners
  private allListeners: Listener<any>[] = [];
  private readonly listenerConfigurations = [
    {
      topic: Topics.ApiAccessCreated,
      listenerClass: ApiAccessCreatedListener,
    },
    {
      topic: Topics.ApiAccessUpdated,
      listenerClass: ApiAccessUpdatedListener,
    },
    {
      topic: Topics.ApiAccessDeleted,
      listenerClass: ApiAccessDeletedListener,
    },
    {
      topic: Topics.SequenceResponseProducts,
      listenerClass: SequenceResponseProductsListener,
    },
    {
      topic: Topics.InventoryUpdated,
      listenerClass: InventoryUpdatedListener,
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
        await wait(1200); // wait to give balancing time
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
      const port = process.env.PORT ?? 3000;
      app.listen(port, () => {
        console.log(`Listening on port ${port}`);
      });
    } catch (error: any) {
      console.error(`Error starting products server`, error);
    }
  };

  shutDown = async () => {
    if (this._isShuttingDown) {
      return;
    }
    this._isShuttingDown = true;

    console.log('Received stop signal, shutting down gracefully...');

    try {
      // Disconnect all registered publishers
      for (const publisher of Object.values(kafkaWrapper.publishers)) {
        await publisher.shutdown();
      }
    } catch (err) {
      console.error('Error during shutdown of publishers:', err);
    }
    try {
      // Disconnect listenerManager
      console.log('Disconnecting listenerManager');
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
