import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  MICROSERVICE_ORDERS,
  currentUser,
  authorize,
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

// ======================================================
// Check for existence of ENV variables set in depl files (dev/prod) or .env file for test
if (
  !(process.env.JWT_SECRET && process.env.EXPIRES_IN && process.env.MONGO_URI)
) {
  console.error('Missing ENV variable for JWT_SECRET, EXPIRES_IN or MONGO_URI');
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
if (
  !(
    process.env.VAT_PERCENTAGE &&
    process.env.SHIPPING_FEE &&
    process.env.THRESHOLD_FREE_SHIPPING
  )
) {
  console.error(
    'Missing ENV variable for VAT_PERCENTAGE, SHIPPING_FEE or THRESHOLD_FREE_SHIPPING'
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
// validate if user (role) is authorized to access API
app.use(authorize(MICROSERVICE_ORDERS));

app.use(getPayPalClientIdRouter);
app.use(getOrdersRouter);
app.use(createOrderRouter);
app.use(getMyOrdersRouter);
app.use(updateOrderToPaidRouter);
app.use(updateOrderToDeliveredRouter);
app.use(getOrderByIdRouter);

// Handle any other (unknown) route API calls
app.all('*', async () => {
  console.log('no match found for this API route!');
  throw new RouteNotFoundError();
});

app.use(errorHandler);

process.on('uncaughtException', (err: any) => {
  console.error(`ERROR: ${err.stack}`);
  console.error('Shutting down due to uncaught exception');
  process.exit(1);
});

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error(`ERROR: ${err.stack}`);
  console.error('Shutting down the server due to Unhandled Promise rejection');
  process.exit(1);
});

export { app };
