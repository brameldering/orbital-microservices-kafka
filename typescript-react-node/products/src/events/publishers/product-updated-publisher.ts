import { Publisher, Topics, ProductUpdatedEvent } from '@orbital_app/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  topic: Topics.ProductUpdated = Topics.ProductUpdated;
}
