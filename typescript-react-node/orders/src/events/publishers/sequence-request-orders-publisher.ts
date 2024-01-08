import {
  Publisher,
  Topics,
  SequenceRequestOrdersEvent,
} from '@orbitelco/common';

export class SequenceRequestOrdersPublisher extends Publisher<SequenceRequestOrdersEvent> {
  topic: Topics.SequenceRequestOrders = Topics.SequenceRequestOrders;
}
