import path from 'path';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
// import compression from 'compression';

import configRoutes from './config/configRoutes';
import connectDB from './general/db/db';
// import configureCORS from './middleware/configureCORS';
import {
  ExtendedError,
  notFound,
  errorHandler,
} from './middleware/errorMiddleware';
import orderRoutes from './order/orderRoutes';
import productRoutes from './product/productRoutes';
import uploadRoutes from './product/uploadImageRoutes';
import userRoutes from './user/userRoutes';

dotenv.config();
const port = process.env.PORT || 5000;
const nodeEnv = process.env.NODE_ENV;

connectDB();

const app = express();

// add compression middleware
// app.use(compression());

// 3rd party middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom middleware
// app.use(configureCORS);
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
if (!allowedOrigins) {
  throw new ExtendedError('Missing setting in .env for CORS_ALLOWED_ORIGINS');
}
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    exposedHeaders: ['Content-Length', 'Origin', 'Accept'],
    credentials: true,
  })
);

// Controllers
app.use('/api/config/v1', configRoutes);
app.use('/api/products/v1', productRoutes);
app.use('/api/upload/v1', uploadRoutes);
app.use('/api/users/v1', userRoutes);
app.use('/api/orders/v1', orderRoutes);

// Set build folder and default route for production or development
if (nodeEnv === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  // app.get('*.js', function (req, res, next) {
  //   req.url = req.url + '.gz';
  //   res.set('Content-Encoding', 'gzip');
  //   next();
  // });
  app.get('*', (req: Request, res: Response) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req: Request, res: Response) => {
    res.send('API is running....');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Handle Uncaught exceptions
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

app.listen(port, () =>
  console.info(`Server running in ${nodeEnv} mode on port ${port}`)
);
