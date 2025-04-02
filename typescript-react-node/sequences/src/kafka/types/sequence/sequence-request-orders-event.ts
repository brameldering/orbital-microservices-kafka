import { Topics } from '../topics';

export interface SequenceRequestOrdersEvent {
  topic: Topics.SequenceRequestOrders;
  key: string; // key is the same as entityObjectId
  data: {
    entityObjectId: string;
  };
}
