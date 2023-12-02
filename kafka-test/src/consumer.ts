// import kafka from 'kafka-node';
// import client from './shared/client-instance';
import { TOPIC_USERS } from './constants';
import createConsumer from './shared/consumer-instance';

// Create consumers within the same consumer group
const consumer1 = createConsumer(TOPIC_USERS, 'users', 'Consumer1');
const consumer2 = createConsumer(TOPIC_USERS, 'users', 'Consumer2');
