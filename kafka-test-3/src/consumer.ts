import { kafkaWrapper } from './kafka-wrapper';
import { ApiAccessCreatedListener } from './events/listeners/api-access-created-listener';
import { ApiAccessUpdatedListener } from './events/listeners/api-access-updated-listener';
import { ApiAccessDeletedListener } from './events/listeners/api-access-deleted-listener';

const KAFKA_URL = 'localhost:9092';

const start = async () => {
  try {
    await kafkaWrapper.connect(KAFKA_URL);
    kafkaWrapper.client.on('close', () => {
      console.log('= Consumer = Kafka connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => {
      console.log('= consumer = Received SIGINT. Closing Kafka connection...');
      kafkaWrapper.client.close();
    });
    process.on('SIGTERM', () => {
      console.log('= consumer = Received SIGTERM. Closing Kafka connection...');
      kafkaWrapper.client.close();
    });
    console.log('= Consumer = after connect');
    new ApiAccessCreatedListener(kafkaWrapper.client).listen();
    new ApiAccessUpdatedListener(kafkaWrapper.client).listen();
    new ApiAccessDeletedListener(kafkaWrapper.client).listen();
  } catch (error) {
    console.error('= consumer = ', error);
  }
};

start();
