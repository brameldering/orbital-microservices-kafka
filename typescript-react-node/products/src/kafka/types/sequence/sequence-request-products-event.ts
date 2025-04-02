import { Topics } from '../topics';

export interface SequenceRequestProductsEvent {
  topic: Topics.SequenceRequestProducts;
  key: string; // key is the same as entityObjectId
  data: {
    entityObjectId: string;
  };
}
