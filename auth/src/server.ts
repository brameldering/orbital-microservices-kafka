import mongoose from 'mongoose';
import { app } from './app';
import { kafkaWrapper } from './kafka-wrapper';

const start = async () => {
  try {
    await kafkaWrapper.connect(process.env.KAFKA_URL!);

    kafkaWrapper.client.on('close', () => {
      console.log('auth - server - kafkaWrapper connection closed!');
      // process.exit();
    });
    process.on('SIGINT', () => {
      console.log('auth - server - received SIGINT');
      kafkaWrapper.client.close();
    });

    process.on('SIGTERM', () => {
      console.log('auth - server - received SIGTERM');
      kafkaWrapper.client.close();
    });

    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
