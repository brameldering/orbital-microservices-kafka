import { Topics } from '../topics';

export interface SequenceResponseOrdersEvent {
  topic: Topics.SequenceResponseOrders;
  key: string; // should be same as entityObjectId
  data: {
    entityObjectId: string;
    sequenceNumber: number;
  };
}
