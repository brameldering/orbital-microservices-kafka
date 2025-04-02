import { Publisher } from '../../kafka/base-publisher';
import { Topics } from '../../kafka/types/topics';
import { ProductUpdatedEvent } from '../../kafka/types/product/product-updated-event';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  topic: Topics.ProductUpdated = Topics.ProductUpdated;
}
