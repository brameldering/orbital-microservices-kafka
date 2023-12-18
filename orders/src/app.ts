import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  currentUser,
  apiAccessCache,
  validateURL,
  errorHandler,
  RouteNotFoundError,
} from '@orbitelco/common';
import { getOrdersRouter } from './routes/get-orders';
import { createOrderRouter } from './routes/create-order';
import { getMyOrdersRouter } from './routes/get-my-orders';
import { updateOrderToPaidRouter } from './routes/update-order-to-paid';
import { updateOrderToDeliveredRouter } from './routes/update-order-to-delivered';
import { getOrderByIdRouter } from './routes/get-order-by-id';
import { getPayPalClientIdRouter } from './routes/get-paypalclientid';
import { getPriceCalcSettingsRouter } from './routes/get-price-calc-settings';
import { updatePriceCalcSettingsRouter } from './routes/update-price-calc-settings';

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
if (!(process.env.JWT_SECRET && process.env.EXPIRES_IN)) {
  console.error('Missing ENV variable for JWT_SECRET or EXPIRES_IN');
  process.exit(1);
}
if (
  !(
    process.env.PAYPAL_CLIENT_ID &&
    process.env.PAYPAL_APP_SECRET &&
    process.env.PAYPAL_API_URL
  )
) {
  console.error(
    'Missing ENV variable for PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET or PAYPAL_API_URL'
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

// Validate URL
app.use(validateURL);
// set req.currentuser if a user is logged in
app.use(currentUser);

const setupApiAccessAndRunApp = async () => {
  try {
    // Initialize cache of API Access Array
    await apiAccessCache.loadCacheFromDB();
    // console.log('=== Auth === apiAccessCache: ', apiAccessCache());

    app.use(getPayPalClientIdRouter);
    app.use(getPriceCalcSettingsRouter);
    app.use(updatePriceCalcSettingsRouter);
    app.use(getOrdersRouter);
    app.use(createOrderRouter);
    app.use(getMyOrdersRouter);
    app.use(updateOrderToPaidRouter);
    app.use(updateOrderToDeliveredRouter);
    app.use(getOrderByIdRouter);

    // Handle any other (unknown) route API calls
    app.all('*', async (req) => {
      console.log('no match found for API route:', req.method, req.originalUrl);
      throw new RouteNotFoundError();
    });

    app.use(errorHandler);
  } catch (error) {
    console.error('Error setting up API access:', error);
    // Handle error setting up API access
    app.use(errorHandler); // You might want to handle this differently based on your use case
  }
};

setupApiAccessAndRunApp();
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

export { app };
