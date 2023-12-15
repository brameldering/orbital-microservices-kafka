import mongoose from 'mongoose';
import { app } from './app';
// import { kafkaWrapper } from './kafka-wrapper';

// const KAFKA_CLIENT_ID = 'auth01';

const start = async () => {
  try {
    // Ensure Kafka connection
    // kafkaWrapper.connect(
    //   KAFKA_CLIENT_ID,
    //   process.env.KAFKA_BROKERS!.split(',')
    // );

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');

    // Start the server
    app.listen(3000, () => {
      console.log('Listening on port 3000');
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
};

start();
