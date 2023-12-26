// Load local .env file settings in case DEPLOY_ENV variable is not defined or not kubernetes
if (!process.env.DEPLOY_ENV || process.env.DEPLOY_ENV !== 'kubernetes') {
  require('dotenv').config();
}
import express from 'express';
import 'express-async-errors';
import {
  errorHandler,
  RouteNotFoundError,
  getKafkaLogLevel,
} from '@orbitelco/common';

// ======================================================
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

const app = express();
app.set('trust proxy', true);

const setupApp = async () => {
  try {
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
  console.error(`ERROR: ${err.stack}`);
  process.exit(1);
});

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('Shutting down the server due to Unhandled Promise rejection');
  console.error(`ERROR: ${err.stack}`);
  process.exit(1);
});

export { app, setupApp };
