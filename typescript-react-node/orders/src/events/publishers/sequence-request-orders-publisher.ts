import { Publisher } from '../../kafka/base-publisher';
import { Topics } from '../../kafka/types/topics';
import { SequenceRequestOrdersEvent } from '../../kafka/types/sequence/sequence-request-orders-event';

export class SequenceRequestOrdersPublisher extends Publisher<SequenceRequestOrdersEvent> {
  topic: Topics.SequenceRequestOrders = Topics.SequenceRequestOrders;
}
