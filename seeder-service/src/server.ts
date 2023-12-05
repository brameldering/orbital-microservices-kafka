import express from 'express';
import mongoose, { Connection } from 'mongoose';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, RouteNotFoundError } from '@orbitelco/common';
import { seedDataRouter } from './routes/seed-data';

// ======================================================
// Check for existence of ENV variables set in depl files (dev/prod) or .env file for test
if (
  !(
    process.env.MONGO_URI_SEQ &&
    process.env.MONGO_URI_AUTH &&
    process.env.MONGO_URI_PRODUCTS &&
    process.env.MONGO_URI_ORDERS
  )
) {
  console.error(
    'Missing ENV variable for MONGO_URI_SEQ, MONGO_URI_AUTH, MONGO_URI_PRODUCTS, and MONGO_URI_ORDERS'
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
app.all('*', async () => {
  console.log('no match found for this API route!');
  throw new RouteNotFoundError();
});

app.use(errorHandler);

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

// let seqDB: Connection;
let authDB: Connection;
let productsDB: Connection;
let ordersDB: Connection;

const start = async () => {
  try {
    // seqDB = mongoose.createConnection(process.env.MONGO_URI_SEQ!);
    // console.log('Connected to MongoDB', process.env.MONGO_URI_SEQ!);

    authDB = mongoose.createConnection(process.env.MONGO_URI_AUTH!);
    console.log('Connected to MongoDB', process.env.MONGO_URI_AUTH!);

    productsDB = mongoose.createConnection(process.env.MONGO_URI_PRODUCTS!);
    console.log('Connected to MongoDB', process.env.MONGO_URI_PRODUCTS!);

    ordersDB = mongoose.createConnection(process.env.MONGO_URI_ORDERS!);
    console.log('Connected to MongoDB', process.env.MONGO_URI_ORDERS!);
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();

export { authDB, productsDB, ordersDB }; // seqDB
