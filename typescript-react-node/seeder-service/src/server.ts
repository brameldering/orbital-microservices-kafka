// Load local .env file settings in case DEPLOY_ENV variable is not defined or not kubernetes
if (!process.env.DEPLOY_ENV || process.env.DEPLOY_ENV !== 'kubernetes') {
  require('dotenv').config();
}
import express from 'express';
import mongoose, { Connection } from 'mongoose';
import { PrismaClient } from '@prisma/client';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  errorHandler,
  RouteNotFoundError,
  kafkaWrapper,
  getKafkaLogLevel,
  Topics,
  wait,
} from '@orbital_app/common';
import { seedDataRouter } from './routes/seed-data';
// import { postgresTableExists } from '../utils/check-table-exists';

function canBeConvertedToNumber(strNumber: string) {
  return !isNaN(parseFloat(strNumber)) && isFinite(parseFloat(strNumber));
}

// ======================================================
// Check for existence of ENV variables set in depl files (dev/prod) or .env file for test
if (
  !(
    process.env.MONGO_URI_SEQUENCES &&
    process.env.MONGO_URI_AUTH &&
    process.env.MONGO_URI_PRODUCTS &&
    process.env.MONGO_URI_ORDERS &&
    process.env.PG_URI_INVENTORY
  )
) {
  console.error(
    'Missing ENV variable for MONGO_URI_SEQUENCES, MONGO_URI_AUTH, MONGO_URI_PRODUCTS, MONGO_URI_ORDERS or PG_URI_INVENTORY'
  );
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
if (
  !(process.env.KAFKA_NUM_PARTITIONS && process.env.KAFKA_REPLICATION_FACTOR)
) {
  console.error(
    'Missing ENV variable for KAFKA_NUM_PARTITIONS or KAFKA_REPLICATION_FACTOR'
  );
  process.exit(1);
}
if (
  !(
    canBeConvertedToNumber(process.env.KAFKA_NUM_PARTITIONS) &&
    canBeConvertedToNumber(process.env.KAFKA_REPLICATION_FACTOR)
  )
) {
  console.error(
    'ENV variable for KAFKA_NUM_PARTITIONS or KAFKA_REPLICATION_FACTOR is not a number'
  );
  process.exit(1);
}

// ======================================================

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(seedDataRouter);

// Handle any other (unknown) route API calls
app.all('*', async (req) => {
  console.error('no match found for API route:', req.method, req.originalUrl);
  throw new RouteNotFoundError();
});

app.use(errorHandler);

// ======================================================================
const KAFKA_CLIENT_ID = 'seeder';
const NumPartitions = Number(process.env.KAFKA_NUM_PARTITIONS!);
const ReplicationFactor = Number(process.env.KAFKA_REPLICATION_FACTOR!);

// ======================================================================
// Initialize Kafka topics and Mongo DB connections
// ======================================================================
let sequencesDB: Connection;
let authDB: Connection;
let productsDB: Connection;
let ordersDB: Connection;
let inventoryDB: PrismaClient;

const start = async () => {
  try {
    // Ensure Kafka connection
    await kafkaWrapper.connect(
      KAFKA_CLIENT_ID,
      process.env.KAFKA_BROKERS!.split(',')
    );

    // Loop through all topics and check/create required topics
    for (const topic of Object.values(Topics)) {
      await kafkaWrapper.ensureTopicExists(
        topic,
        NumPartitions,
        ReplicationFactor
      );
      await wait(100); // wait to give balancing time
    }

    sequencesDB = mongoose.createConnection(process.env.MONGO_URI_SEQUENCES!);
    console.log('Connected to MongoDB', process.env.MONGO_URI_SEQUENCES!);

    authDB = mongoose.createConnection(process.env.MONGO_URI_AUTH!);
    console.log('Connected to MongoDB', process.env.MONGO_URI_AUTH!);

    productsDB = mongoose.createConnection(process.env.MONGO_URI_PRODUCTS!);
    console.log('Connected to MongoDB', process.env.MONGO_URI_PRODUCTS!);

    ordersDB = mongoose.createConnection(process.env.MONGO_URI_ORDERS!);
    console.log('Connected to MongoDB', process.env.MONGO_URI_ORDERS!);

    inventoryDB = new PrismaClient();
    console.log(
      'Instantiated Prisma client for',
      process.env.PG_URI_INVENTORY!
    );
    // const productInventoryExists = await postgresTableExists(
    //   'inventory',
    //   'product_inventory'
    // );
    // if (!productInventoryExists) {
    //   console.error(
    //     'Postgres Inventory database has not been initialized: table PRODUCT_INVENTORY does not exist'
    //   );
    //   process.exit(1);
    // }

    // Start listening
    const port = process.env.PORT ?? 3000;
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error: any) {
    console.error(`Error starting seeder server`, error);
  }
};

const shutDown = async () => {
  console.log('Received stop signal, shutting down gracefully');
  try {
    // Close each named connection
    await Promise.all([
      sequencesDB.close(),
      authDB.close(),
      productsDB.close(),
      ordersDB.close(),
      inventoryDB.$disconnect(),
    ]);
    console.log('All database connections closed');

    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

start();

// Handle graceful shutdown
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

process.on('uncaughtException', (err: Error) => {
  console.error(`ERROR: ${err.stack}`);
  console.error('Shutting down due to uncaught exception');
  process.exit(1);
});

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error(`ERROR: ${err.stack}`);
  console.error('Shutting down the server due to Unhandled Promise rejection');
  process.exit(1);
});

export { sequencesDB, authDB, productsDB, ordersDB, inventoryDB };
