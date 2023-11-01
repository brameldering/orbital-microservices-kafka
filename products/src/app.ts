import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {
  currentUser,
  errorHandler,
  RouteNotFoundError,
} from '@orbitelco/common';
import { getProductsRouter } from './routes/get-products';
import { createProductRouter } from './routes/create-product';
import { getProductByIdRouter } from './routes/get-product-by-id';
import { updateProductRouter } from './routes/update-product';
import { deleteProductRouter } from './routes/delete-product';
import { createProductReviewRouter } from './routes/create-product-review';

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
// set req.currentuser if a user is logged in
app.use(currentUser);

app.use(getProductsRouter);
app.use(createProductRouter);
app.use(getProductByIdRouter);
app.use(updateProductRouter);
app.use(deleteProductRouter);
app.use(createProductReviewRouter);

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
