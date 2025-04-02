import { Publisher } from '../../kafka/base-publisher';
import { Topics } from '../../kafka/types/topics';
import { SequenceResponseProductsEvent } from '../../kafka/types/sequence/sequence-response-products-event';


export class SequenceResponseProductsPublisher extends Publisher<SequenceResponseProductsEvent> {
  topic: Topics.SequenceResponseProducts = Topics.SequenceResponseProducts;
}
