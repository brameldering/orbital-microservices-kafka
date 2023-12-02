import kafka from 'kafka-node';
import producer from './shared/producer-instance';
import { TOPIC_USERS } from './constants';

const sendMessage = (
  partition: number,
  id: string,
  name: string,
  email: string
) => {
  const key = id;
  const payload = [
    {
      topic: TOPIC_USERS,
      partition,
      messages: new kafka.KeyedMessage(
        key,
        JSON.stringify({
          id,
          name,
          email,
        })
      ),
    },
  ];

  producer.send(payload, (error, data) => {
    if (error) {
      console.error('Error in publishing message:', error);
    } else {
      console.log('Message successfully published:', data);
    }
  });
};

const partition1 = 0;
const id1 = 'id1';
const name1 = 'user1';
const email1 = name1 + '@test.com';
sendMessage(partition1, id1, name1, email1);

const partition2 = 1;
const id2 = 'id2';
const name2 = 'user2';
const email2 = name2 + '@test.com';
sendMessage(partition2, id2, name2, email2);
