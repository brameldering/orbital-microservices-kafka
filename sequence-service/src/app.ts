import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  currentUser,
  authorizeSeqService,
  errorHandler,
  RouteNotFoundError,
} from '@orbitelco/common';
import { createSequenceRecordRouter } from './routes/create-sequence-id';
import { getProductSequenceIdRouter } from './routes/get-product-seq-id';
import { getOrderSequenceIdRouter } from './routes/get-order-seq-id';

// ======================================================
// Check for existence of ENV variables set in depl files (dev/prod) or .env file for test
if (!process.env.MONGO_URI) {
  console.error('Missing ENV variable for MONGO_URI');
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
// set req.currentuser if a user is logged in
app.use(currentUser);
// validate if user (role) is authorized to access API
app.use(authorizeSeqService);

app.use(createSequenceRecordRouter);
app.use(getProductSequenceIdRouter);
app.use(getOrderSequenceIdRouter);

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
