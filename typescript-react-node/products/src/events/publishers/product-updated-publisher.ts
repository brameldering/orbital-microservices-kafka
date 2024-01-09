import { Publisher, Topics, ProductUpdatedEvent } from '@orbitelco/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  topic: Topics.ProductUpdated = Topics.ProductUpdated;
}
