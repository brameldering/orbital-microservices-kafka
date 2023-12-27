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
  apiAccessCache,
  validateURL,
  errorHandler,
  RouteNotFoundError,
} from '@orbitelco/common';
import { uploadFileRouter } from './routes/upload-file';
import { getProductsRouter } from './routes/get-products';
import { createProductRouter } from './routes/create-product';
import { getProductByIdRouter } from './routes/get-product-by-id';
import { updateProductRouter } from './routes/update-product';
import { deleteProductRouter } from './routes/delete-product';
import { createProductReviewRouter } from './routes/create-product-review';

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
if (!(process.env.JWT_SECRET && process.env.EXPIRES_IN)) {
  console.error('Missing ENV variable for JWT_SECRET or EXPIRES_IN');
  process.exit(1);
}
if (
  !(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_SAMPLE_IMAGE_URL
  )
) {
  console.error(
    'Missing ENV variable for CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET or CLOUDINARY_SAMPLE_IMAGE_URL'
  );
  process.exit(1);
}
if (
  !process.env.PRODUCTS_PER_PAGE ||
  isNaN(Number(process.env.PRODUCTS_PER_PAGE))
) {
  console.error('ENV variable PRODUCTS_PER_PAGE is missing or not a number.');
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

const setupApp = async () => {
  try {
    // Initialize cache of API Access Array
    await apiAccessCache.loadCacheFromDB();

    app.use(uploadFileRouter);
    app.use(createProductReviewRouter);
    app.use(getProductsRouter);
    app.use(getProductByIdRouter);
    app.use(createProductRouter);
    app.use(updateProductRouter);
    app.use(deleteProductRouter);

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
