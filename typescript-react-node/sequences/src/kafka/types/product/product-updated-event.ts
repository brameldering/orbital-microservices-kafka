import { Topics } from '../topics';

export interface ProductUpdatedEvent {
  topic: Topics.ProductUpdated;
  key: string;
  data: {
    id: string;
    productId: string;
    name: string;
    brand: string;
    category: string;
  };
}
