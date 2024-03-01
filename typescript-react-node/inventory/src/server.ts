import { app, setupApp } from './app';
import { PrismaClient } from '@prisma/client';
import {
  kafkaWrapper,
  Topics,
  Listener,
  ListenerManager,
  IConsumerConfig,
  wait,
  // ApplicationServerError,
} from '@orbital_app/common';
import { ApiAccessCreatedListener } from './events/listeners/api-access-created-listener';
import { ApiAccessUpdatedListener } from './events/listeners/api-access-updated-listener';
import { ApiAccessDeletedListener } from './events/listeners/api-access-deleted-listener';
import { ProductCreatedListener } from './events/listeners/product-created-listener';
import { ProductUpdatedListener } from './events/listeners/product-updated-listener';
import { ProductDeletedListener } from './events/listeners/product-deleted-listener';
import { InventoryUpdatedPublisher } from './events/publishers/inventory-updated-publisher';

class Server {
  private readonly KAFKA_CLIENT_ID = 'inventory';
  private readonly CONSUMER_GROUP = 'inventory';
  private _inventoryDB?: PrismaClient;
  private _isShuttingDown: boolean = false;

  // ===================================================================
  private publisherConfigurations = [
    {
      topic: Topics.InventoryUpdated,
      publisherClass: InventoryUpdatedPublisher,
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
      topic: Topics.ProductCreated,
      listenerClass: ProductCreatedListener,
    },
    {
      topic: Topics.ProductUpdated,
      listenerClass: ProductUpdatedListener,
    },
    {
      topic: Topics.ProductDeleted,
      listenerClass: ProductDeletedListener,
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
      // Connect to Postgres
      console.log('Before instantiating PrismaClient');
      this._inventoryDB = new PrismaClient();
      console.log('After instantiating PrismaClient');
      console.log(
        'inventory server.ts: Instantiated Prisma client for',
        process.env.PG_URI_INVENTORY!
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
        const listener = new config.listenerClass(this._inventoryDB);
        await this.listenerManager.registerListener(listener);
        this.allListeners.push(listener);
        await wait(1200); // wait to give balancing time
      }

      // Start listening for registered listeners
      await this.listenerManager.listen();

      // ===================================================================
      // Setup App including caching of ApiAccess after mongoose connection has been established
      await setupApp(this._inventoryDB);

      // Start listening
      const port = process.env.PORT ?? 3000;
      app.listen(port, () => {
        console.log(`Listening on port ${port}`);
      });
    } catch (error: any) {
      console.error(`Error starting inventory server`, error);
    }
  };

  // get inventoryDB() {
  //   if (inventoryDB) {
  //     console.error(
  //       'Cannot get inventoryDB, use the server.start() method first before get inventoryDB'
  //     );
  //     throw new ApplicationServerError(
  //       'Cannot get inventoryDB, use the server.start() method first before get inventoryDB'
  //     );
  //   }
  //   return inventoryDB;
  // }

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
      // Disconnect Postgres connection
      await this._inventoryDB?.$disconnect();
      console.log('InventoryDB disconnected');

      process.exit(0);
    } catch (err) {
      console.error('Error during InventoryDB disconnect:', err);
    }
  };
}

const server = new Server();
server.start();

// Handle graceful shutdown
process.on('SIGTERM', () => server.shutDown());
process.on('SIGINT', () => server.shutDown());