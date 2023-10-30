import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { getUsersRouter } from './routes/get-users';
import { updateUserProfileRouter } from './routes/update-user-profile';
import { updatePasswordRouter } from './routes/update-password';
import { resetPasswordRouter } from './routes/reset-password';
import { getUserByIdRouter } from './routes/get-user-by-id';
import { updateUserRouter } from './routes/update-user';
import { deleteUserRouter } from './routes/delete-user';
import {
  currentUser,
  errorHandler,
  RouteNotFoundError,
} from '@orbitelco/common';

// ======================================================
// Check for existence of ENV variables set in depl files (dev/prod) or .env file for test
if (
  !(process.env.JWT_SECRET && process.env.EXPIRES_IN && process.env.MONGO_URI)
) {
  console.error(
    'Missing ENV variables for JWT_SECRET or EXPIRES_IN or MONGO_URI'
  );
  process.exit(1);
}
if (!process.env.DEFAULT_RESET_PASSWORD) {
  console.error(
    'DEFAULT_RESET_PASSWORD setting is missing from environment vars.'
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
// set req.currentuser if a user is logged in
app.use(currentUser);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(getUsersRouter);
app.use(updateUserProfileRouter);
app.use(updatePasswordRouter);
app.use(resetPasswordRouter);
app.use(getUserByIdRouter);
app.use(updateUserRouter);
app.use(deleteUserRouter);

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
