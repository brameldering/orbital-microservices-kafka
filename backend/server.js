import path from 'path';
import express from 'express';
// import compression from 'compression';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './general/db/db.js';
import configureCORS from './middleware/configureCORS.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import configRoutes from './config/configRoutes.js';
import productRoutes from './product/productRoutes.js';
import uploadRoutes from './product/uploadImageRoutes.js';
import userRoutes from './user/userRoutes.js';
import orderRoutes from './order/orderRoutes.js';

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

// add compression middleware
// app.use(compression());

// 3rd party middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom middleware
app.use(configureCORS);

// Controllers
app.use('/api/config/v1', configRoutes);
app.use('/api/products/v1', productRoutes);
app.use('/api/upload/v1', uploadRoutes);
app.use('/api/users/v1', userRoutes);
app.use('/api/orders/v1', orderRoutes);

// Set build folder and default route for production or development
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  // app.get('*.js', function (req, res, next) {
  //   req.url = req.url + '.gz';
  //   res.set('Content-Encoding', 'gzip');
  //   next();
  // });
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Handle Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`ERROR: ${err.stack}`);
  console.error('Shutting down due to uncaught exception');
  process.exit(1);
});

// Handle Unhandled Promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`ERROR: ${err.stack}`);
  console.error('Shutting down the server due to Unhandled Promise rejection');
  server.close(() => {
    process.exit(1);
  });
});

app.listen(port, () =>
  console.info(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
