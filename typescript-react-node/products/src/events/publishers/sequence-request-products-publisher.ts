import { Publisher } from '../../kafka/base-publisher';
import { Topics } from '../../kafka/types/topics';
import { SequenceRequestProductsEvent } from '../../kafka/types/sequence/sequence-request-products-event';

export class SequenceRequestProductsPublisher extends Publisher<SequenceRequestProductsEvent> {
  topic: Topics.SequenceRequestProducts = Topics.SequenceRequestProducts;
}
