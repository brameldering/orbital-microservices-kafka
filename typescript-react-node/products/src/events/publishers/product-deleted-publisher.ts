import { Publisher } from '../../kafka/base-publisher';
import { Topics } from '../../kafka/types/topics';
import { ProductDeletedEvent } from '../../kafka/types/product/product-deleted-event';

export class ProductDeletedPublisher extends Publisher<ProductDeletedEvent> {
  topic: Topics.ProductDeleted = Topics.ProductDeleted;
}
