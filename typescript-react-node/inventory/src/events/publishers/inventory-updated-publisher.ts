import { Publisher, Topics, InventoryUpdatedEvent } from '@orbital_app/common';

export class InventoryUpdatedPublisher extends Publisher<InventoryUpdatedEvent> {
  topic: Topics.InventoryUpdated = Topics.InventoryUpdated;
}
