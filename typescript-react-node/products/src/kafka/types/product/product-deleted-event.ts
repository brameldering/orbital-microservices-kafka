import { Topics } from '../topics';

export interface ProductDeletedEvent {
  topic: Topics.ProductDeleted;
  key: string;
  data: {
    id: string;
    productId: string;
  };
}
