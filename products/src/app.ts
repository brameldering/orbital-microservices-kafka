import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, RouteNotFoundError } from '@orbitelco/common';
import { createProductRouter } from './routes/createProduct';
import { getProductByIdRouter } from './routes/getProductById';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(createProductRouter);
app.use(getProductByIdRouter);

// Handle any other (unknown) route API calls
app.all('*', async () => {
  console.log('app.all *');
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
