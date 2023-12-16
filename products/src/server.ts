import mongoose from 'mongoose';
import { app } from './app';
import { kafkaWrapper } from './kafka-wrapper';
import { ApiAccessCreatedListener } from './events/listeners/api-access-created-listener';
import { ApiAccessUpdatedListener } from './events/listeners/api-access-updated-listener';
import { ApiAccessDeletedListener } from './events/listeners/api-access-deleted-listener';

const KAFKA_CLIENT_ID = 'products01';

const start = async () => {
  try {
    // Create Kafka connection
    kafkaWrapper.connect(
      KAFKA_CLIENT_ID,
      process.env.KAFKA_BROKERS!.split(',')
    );

    new ApiAccessCreatedListener(
      kafkaWrapper.client,
      'products_ApiAccessCreatedConsumerGroup'
    ).listen();

    new ApiAccessUpdatedListener(
      kafkaWrapper.client,
      'products_ApiAccessUpdatedConsumerGroup'
    ).listen();

    new ApiAccessDeletedListener(
      kafkaWrapper.client,
      'products_ApiAccessDeletedConsumerGroup'
    ).listen();

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
