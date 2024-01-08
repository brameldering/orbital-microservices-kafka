import { kafkaWrapper } from './kafka-wrapper';
import { ApiAccessCreatedPublisher } from './events/publishers/api-access-created-publisher';
import { ApiAccessUpdatedPublisher } from './events/publishers/api-access-updated-publisher';
import { ApiAccessDeletedPublisher } from './events/publishers/api-access-deleted-publisher';

const KAFKA_URL = 'localhost:9092';

const start = async () => {
  try {
    await kafkaWrapper.connect(KAFKA_URL);
    kafkaWrapper.client.on('close', () => {
      console.log('= Producer = Kafka connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => {
      console.log('= producer = Received SIGINT. Closing Kafka connection...');
      kafkaWrapper.client.close();
    });
    process.on('SIGTERM', () => {
      console.log('= producer = Received SIGTERM. Closing Kafka connection...');
      kafkaWrapper.client.close();
    });
    new ApiAccessCreatedPublisher(kafkaWrapper.client).publish({
      id: 'ApiAccessId_1',
      microservice: 'Products',
      apiName: 'product-api-1',
      allowedRoles: ['customer', 'admin'],
    });
    new ApiAccessUpdatedPublisher(kafkaWrapper.client).publish({
      id: 'ApiAccessId_1',
      allowedRoles: ['admin'],
    });
    new ApiAccessDeletedPublisher(kafkaWrapper.client).publish({
      id: 'ApiAccessId_1',
    });
  } catch (error: any) {
    console.error(error);
  }
};

start();
