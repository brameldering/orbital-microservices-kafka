import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connectURL: string | undefined = process.env.MONGO_URI;
    if (connectURL !== undefined) {
      const conn = await mongoose.connect(connectURL);
      console.info(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
