// Load local .env file settings in case DEPLOY_ENV variable is not defined or not kubernetes
if (!process.env.DEPLOY_ENV || process.env.DEPLOY_ENV !== 'kubernetes') {
  require('dotenv').config();
}
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { getRolesRouter } from './routes/roles/get-roles';
import { createRoleRouter } from './routes/roles/create-role';
import { getRoleByIdRouter } from './routes/roles/get-role-by-id';
import { updateRoleRouter } from './routes/roles/update-role-display';
import { deleteRoleRouter } from './routes/roles/delete-role';
import { getApiAccessesRouter } from './routes/api-access/get-api-accesses';
import { createApiAccessRouter } from './routes/api-access/create-api-access';
import { getApiAccessByIdRouter } from './routes/api-access/get-api-access-by-id';
import { updateApiAccessRolesRouter } from './routes/api-access/update-api-access-roles';
import { deleteApiAccessRouter } from './routes/api-access/delete-api-access';
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
  getKafkaLogLevel,
  apiAccessCache,
  currentUser,
  validateURL,
  errorHandler,
  RouteNotFoundError,
} from '@orbital_app/common';

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
if (!process.env.DEFAULT_RESET_PASSWORD) {
  console.error('Missing ENV variable for DEFAULT_RESET_PASSWORD');
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

    app.use(getApiAccessesRouter);
    app.use(createApiAccessRouter);
    app.use(getApiAccessByIdRouter);
    app.use(updateApiAccessRolesRouter);
    app.use(deleteApiAccessRouter);
    app.use(getRolesRouter);
    app.use(createRoleRouter);
    app.use(getRoleByIdRouter);
    app.use(updateRoleRouter);
    app.use(deleteRoleRouter);
    app.use(currentUserRouter);
    app.use(signupRouter);
    app.use(signinRouter);
    app.use(signoutRouter);
    app.use(resetPasswordRouter);
    app.use(updatePasswordRouter);
    app.use(updateUserProfileRouter);
    app.use(getUsersRouter);
    app.use(getUserByIdRouter);
    app.use(updateUserRouter);
    app.use(deleteUserRouter);

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
