import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import mongoose from 'mongoose';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handler';
import {
  RouteNoteFoundError,
  EnvConfigurationError,
} from './types/error-types';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Handle any other (unknown) route API calls
app.all('*', async () => {
  console.log('app.all *');
  throw new RouteNoteFoundError();
});

app.use(errorHandler);

const start = async () => {
  // Check for existence of ENV variables set in depl files
  if (
    !(
      (process.env.JWT_SECRET && process.env.EXPIRES_IN)
      // && process.env.COOKIE_EXPIRES_TIME &&
      // !isNaN(Number(process.env.COOKIE_EXPIRES_TIME))
    )
  ) {
    throw new EnvConfigurationError(
      'Missing ENV variables for JWT_SECRET or EXPIRES_IN'
    );
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }

  app.listen(5001, () => {
    console.log('Listening on port 5001');
  });
};

start();
