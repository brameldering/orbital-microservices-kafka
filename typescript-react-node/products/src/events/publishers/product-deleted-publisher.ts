import { Publisher, Topics, ProductDeletedEvent } from '@orbital_app/common';

export class ProductDeletedPublisher extends Publisher<ProductDeletedEvent> {
  topic: Topics.ProductDeleted = Topics.ProductDeleted;
}
