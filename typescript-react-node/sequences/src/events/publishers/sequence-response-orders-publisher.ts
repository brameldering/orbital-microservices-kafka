import { Publisher } from '../../kafka/base-publisher';
import { Topics } from '../../kafka/types/topics';
import { SequenceResponseOrdersEvent } from '../../kafka/types/sequence/sequence-response-orders-event';

export class SequenceResponseOrdersPublisher extends Publisher<SequenceResponseOrdersEvent> {
  topic: Topics.SequenceResponseOrders = Topics.SequenceResponseOrders;
}
