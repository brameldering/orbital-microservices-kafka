import { Topics } from '../topics';

export interface ProductCreatedEvent {
  topic: Topics.ProductCreated;
  key: string;
  data: {
    id: string;
    productId: string;
    name: string;
    brand: string;
    category: string;
  };
}
