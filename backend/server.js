import path from 'path';
import express from 'express';
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
// ================= Configure CORS =================
app.use((req, res, next) => {
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS;
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', allowedOrigins);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept');
  res.header(
    'Access-Control-Allow-Methods',
    'POST, GET, PUT, PATCH, DELETE, OPTIONS'
  );
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
// ==================================================

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
