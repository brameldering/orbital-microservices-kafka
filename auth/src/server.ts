import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  // Check for existence of ENV variables set in depl files
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
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
