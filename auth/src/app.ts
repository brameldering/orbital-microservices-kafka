import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { getRolesRouter } from './routes/user-roles/get-roles';
import { createRoleRouter } from './routes/user-roles/create-role';
import { deleteRoleRouter } from './routes/user-roles/delete-role';
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
  AUTH_APIS,
  IApiAccessObj,
  currentUser,
  authorize,
  validateURL,
  errorHandler,
  RouteNotFoundError,
} from '@orbitelco/common';
import { getApiAccessArray } from './utils/loadApiAccessArray';

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

// Validate URL
app.use(validateURL);
// set req.currentuser if a user is logged in
app.use(currentUser);

const setupApiAccessAndRunApp = async () => {
  // ======= api access authorization logic =========
  let apiAccessArray: IApiAccessObj[] = [];
  try {
    // console.log('==> before getApiAccessArray');
    apiAccessArray = await getApiAccessArray();
    // console.log('=== Auth === apiAccessArray: ', apiAccessArray);

    // validate if user (role) is authorized to access API
    app.use(authorize(AUTH_APIS, apiAccessArray));
    // =================================================

    app.use(getApiAccessesRouter);
    app.use(createApiAccessRouter);
    app.use(getApiAccessByIdRouter);
    app.use(updateApiAccessRolesRouter);
    app.use(deleteApiAccessRouter);
    app.use(getRolesRouter);
    app.use(createRoleRouter);
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
