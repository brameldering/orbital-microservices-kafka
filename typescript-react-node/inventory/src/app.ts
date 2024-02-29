// Load local .env file settings in case DEPLOY_ENV variable is not defined or not kubernetes
if (!process.env.DEPLOY_ENV || process.env.DEPLOY_ENV !== 'kubernetes') {
  require('dotenv').config();
}
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  getKafkaLogLevel,
  currentUser,
  apiAccessCachePostgres,
  validateURL,
  errorHandler,
  RouteNotFoundError,
} from '@orbital_app/common';
import { getProductInventoryRouter } from './routes/get-product-inventory';
import { getProductInventoryByIdRouter } from './routes/get-product-inventory-by-id';
import { updateProductInventoryRouter } from './routes/update-product-inventory';
import { createSerialNumberRouter } from './routes/create-serial-number';
import { getSerialNumbersByProductIdRouter } from './routes/get-serial-numbers-by-product-id';
import { getSerialNumbersByStatusRouter } from './routes/get-serial-numbers-by-status';
import { updateSerialNumberStatusRouter } from './routes/update-serial-number-status';
import { PrismaClient } from '@prisma/client';

// ======================================================
// Check for existence of ENV variables set in depl files (dev/prod) or .env file for test
if (!process.env.PG_URI_INVENTORY) {
  console.error('Missing ENV variable for PG_URI_INVENTORY');
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
if (!(process.env.JWT_SECRET && process.env.EXPIRES_IN)) {
  console.error('Missing ENV variable for JWT_SECRET or EXPIRES_IN');
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

// Validate URL
app.use(validateURL);
// set req.currentuser if a user is logged in
app.use(currentUser);

const setupApp = async (inventoryDB: PrismaClient) => {
  try {
    // Initialize cache of API Access Array
    await apiAccessCachePostgres.loadCacheFromDB(inventoryDB);
    // console.log('apiAccessCachePostgres.cache', apiAccessCachePostgres.cache);

    app.use(getProductInventoryRouter(inventoryDB));
    app.use(getProductInventoryByIdRouter(inventoryDB));
    app.use(updateProductInventoryRouter(inventoryDB));
    app.use(getSerialNumbersByProductIdRouter(inventoryDB));
    app.use(getSerialNumbersByStatusRouter(inventoryDB));
    app.use(createSerialNumberRouter(inventoryDB));
    app.use(updateSerialNumberStatusRouter(inventoryDB));

    // Handle any other (unknown) route API calls
    app.all('*', async (req) => {
      console.error(
        'no match found for API route:',
        req.method,
        req.originalUrl
      );
      throw new RouteNotFoundError();
    });

    app.use(errorHandler);
  } catch (error: any) {
    console.error('Error setting up API access:', error);
    // Handle error setting up API access
    app.use(errorHandler); // You might want to handle this differently based on your use case
  }
};

process.on('uncaughtException', (err: any) => {
  console.error('Shutting down due to uncaught exception');
  console.error(`ERROR: ${err.message} - ${err.stack}`);
  process.exit(1);
});

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('Shutting down the server due to Unhandled Promise rejection');
  console.error(`ERROR: ${err.message} - ${err.stack}`);
  process.exit(1);
});

export { app, setupApp };
