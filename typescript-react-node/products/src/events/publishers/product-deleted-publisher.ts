import { Publisher, Topics, ProductDeletedEvent } from '@orbitelco/common';

export class ProductDeletedPublisher extends Publisher<ProductDeletedEvent> {
  topic: Topics.ProductDeleted = Topics.ProductDeleted;
}
