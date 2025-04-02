import { Topics } from '../topics';

export interface SequenceResponseProductsEvent {
  topic: Topics.SequenceResponseProducts;
  key: string; // should be same as entityObjectId
  data: {
    entityObjectId: string;
    sequenceNumber: number;
  };
}
