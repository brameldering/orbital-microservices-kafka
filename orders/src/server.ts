import mongoose from 'mongoose';
import { app } from './app';
// import { kafkaWrapper } from './kafka-wrapper';
// import { ApiAccessCreatedListener } from './events/listeners/api-access-created-listener';
// import { ApiAccessUpdatedListener } from './events/listeners/api-access-updated-listener';
// import { ApiAccessDeletedListener } from './events/listeners/api-access-deleted-listener';

const start = async () => {
  try {
    // await kafkaWrapper.connect(process.env.KAFKA_URL!);

    // kafkaWrapper.client.on('close', () => {
    //   console.log('orders - server - kafkaWrapper connection closed!');
    //   // process.exit();
    // });
    // process.on('SIGINT', () => {
    //   console.log('orders - server - received SIGINT');
    //   kafkaWrapper.client.close();
    // });

    // process.on('SIGTERM', () => {
    //   console.log('orders - server - received SIGTERM');
    //   kafkaWrapper.client.close();
    // });
    // new ApiAccessCreatedListener(kafkaWrapper.client).listen();
    // new ApiAccessUpdatedListener(kafkaWrapper.client).listen();
    // new ApiAccessDeletedListener(kafkaWrapper.client).listen();

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
