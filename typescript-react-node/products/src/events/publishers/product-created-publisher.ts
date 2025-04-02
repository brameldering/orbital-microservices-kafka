import { Publisher } from '../../kafka/base-publisher';
import { Topics } from '../../kafka/types/topics';
import { ProductCreatedEvent } from '../../kafka/types/product/product-created-event';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  topic: Topics.ProductCreated = Topics.ProductCreated;
}
