import mongoose from 'mongoose';
import { app } from './app';
import { kafkaWrapper, Topics } from '@orbitelco/common';
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

    // Ensure topic exists and create listener
    // TO DO: potentially refactor to ensuretopic exists in baselistener and basepublisher
    await kafkaWrapper.ensureTopicExists(Topics.ApiAccessCreated);
    new ApiAccessCreatedListener(
      kafkaWrapper.client,
      'products_ApiAccessCreatedConsumerGroup'
    ).listen();

    // Ensure topic exists and create listener
    // TO DO: potentially refactor to ensuretopic exists in baselistener and basepublisher
    await kafkaWrapper.ensureTopicExists(Topics.ApiAccessUpdated);
    new ApiAccessUpdatedListener(
      kafkaWrapper.client,
      'products_ApiAccessUpdatedConsumerGroup'
    ).listen();

    // Ensure topic exists and create listener
    // TO DO: potentially refactor to ensuretopic exists in baselistener and basepublisher
    await kafkaWrapper.ensureTopicExists(Topics.ApiAccessDeleted);
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
