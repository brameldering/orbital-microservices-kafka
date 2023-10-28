import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  // Check for existence of ENV variables set in depl files
  if (!(process.env.JWT_SECRET && process.env.MONGO_URI)) {
    console.error('Missing ENV variable for JWT_SECRET or MONGO_URI');
    process.exit(1);
  }
  if (
    !(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_SAMPLE_IMAGE_URL
    )
  ) {
    console.error(
      'Missing ENV variable for CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET or CLOUDINARY_SAMPLE_IMAGE_URL'
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
