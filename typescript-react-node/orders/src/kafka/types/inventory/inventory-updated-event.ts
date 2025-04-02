import { Topics } from '../topics';

export interface InventoryUpdatedEvent {
  topic: Topics.InventoryUpdated;
  key: string;
  data: {
    productId: string;
    quantity: number;
  };
}
