import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './general/config/db.js';
import {
  notFound,
  errorHandler,
} from './general/middleware/errorMiddleware.js';
import productRoutes from './product/routes/productRoutes.js';
import userRoutes from './user/routes/userRoutes.js';
import orderRoutes from './order/routes/orderRoutes.js';
import uploadRoutes from './product/routes/uploadRoutes.js';

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
// app.use(cors());
// app.use(
//   cors({
// origin: process.env.CORS_ALLOWED_ORIGINS,
// credentials: true,
//   })
// );
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// API to provide the PAYPAL_CLIENT_ID from .env to frontend
app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Set upload path, build folder and default route for production or development
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  // development
  const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

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
