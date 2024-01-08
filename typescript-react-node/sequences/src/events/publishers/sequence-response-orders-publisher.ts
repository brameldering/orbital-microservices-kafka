import {
  Publisher,
  Topics,
  SequenceResponseOrdersEvent,
} from '@orbitelco/common';

export class SequenceResponseOrdersPublisher extends Publisher<SequenceResponseOrdersEvent> {
  topic: Topics.SequenceResponseOrders = Topics.SequenceResponseOrders;
}
