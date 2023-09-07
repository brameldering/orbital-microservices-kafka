import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './general/config/db.js';
import configureCORS from './general/middleware/configureCORS.js';
import {
  notFound,
  errorHandler,
} from './general/middleware/errorMiddleware.js';
import productRoutes from './product/routes/productRoutes.js';
import userRoutes from './user/routes/userRoutes.js';
import orderRoutes from './order/routes/orderRoutes.js';
import uploadRoutes from './product/routes/uploadImageRoutes.js';
import { configFileUploadCloudinary } from './product/fileUploadHelpers/uploadToCloudinary.js';
import { ENV_CONFIG_CLOUDINARY } from './constantsBackend.js';

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

// 3rd party middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Custom middleware
app.use(configureCORS);

// Controllers
if (process.env.IMAGE_STORAGE_LOCATION === ENV_CONFIG_CLOUDINARY) {
  app.use('/api/upload/v1', configFileUploadCloudinary);
}
app.use('/api/products/v1', productRoutes);
app.use('/api/users/v1', userRoutes);
app.use('/api/orders/v1', orderRoutes);
app.use('/api/upload/v1', uploadRoutes);

// API to provide the PAYPAL_CLIENT_ID from .env to frontend
app.get('/api/config/v1/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Set upload path, build folder and default route for production or development
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  // TO UPDATE BECAUSE THE FOLLOWING WILL PROBABLY NOT WORK ON PRODUCTION
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  // development
  // app.use(express.static(PUBLIC_URL));
  // app.use('/uploads', express.static(uploadPath));
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
