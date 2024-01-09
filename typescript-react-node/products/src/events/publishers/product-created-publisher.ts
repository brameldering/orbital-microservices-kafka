import { Publisher, Topics, ProductCreatedEvent } from '@orbitelco/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  topic: Topics.ProductCreated = Topics.ProductCreated;
}
