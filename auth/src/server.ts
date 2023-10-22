import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  // Check for existence of ENV variables set in depl files
  if (
    !(
      (process.env.JWT_SECRET && process.env.EXPIRES_IN)
      // && process.env.COOKIE_EXPIRES_TIME &&
      // !isNaN(Number(process.env.COOKIE_EXPIRES_TIME))
    )
  ) {
    console.error('Missing ENV variables for JWT_SECRET or EXPIRES_IN');
    process.exit(1);
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
