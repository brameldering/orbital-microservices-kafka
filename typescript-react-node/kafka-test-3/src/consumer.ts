import { kafkaWrapper, ListenerManager } from '@orbitelco/common';
// import { ApiAccessCreatedListener } from './events/listeners/api-access-created-listener';
import { ApiAccessUpdatedListener } from './events/listeners/api-access-updated-listener';
// import { ApiAccessDeletedListener } from './events/listeners/api-access-deleted-listener';

const KAFKA_URL = ['localhost:9092'];

process.env.KAFKA_LOG_LEVEL = 'ERROR';

const start = async () => {
  try {
    await kafkaWrapper.connect('kafka-test-3', KAFKA_URL);
    console.log('Connected to client using kafkawrapper');

    const listenerManager = new ListenerManager(
      kafkaWrapper.client,
      'TestConsumerGroup',
      {
        sessionTimeout: 60000,
        rebalanceTimeout: 30000,
        heartbeatInterval: 3000,
        allowAutoTopicCreation: true,
      }
    );
    await listenerManager.connect();
    console.log('Connected to consumer using listenerManager');

    const listener = new ApiAccessUpdatedListener();
    await listenerManager.registerListener(listener);
    console.log('consumer.ts registered listener for topic', listener.topic);
    listenerManager.listen();
  } catch (error: any) {
    console.error('= consumer = ', error);
  }
};

start();
