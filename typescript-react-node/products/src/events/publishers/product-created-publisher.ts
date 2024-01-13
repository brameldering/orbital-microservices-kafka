import { Publisher, Topics, ProductCreatedEvent } from '@orbital_app/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  topic: Topics.ProductCreated = Topics.ProductCreated;
}
