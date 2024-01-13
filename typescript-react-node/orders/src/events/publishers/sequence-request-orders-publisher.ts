import {
  Publisher,
  Topics,
  SequenceRequestOrdersEvent,
} from '@orbital_app/common';

export class SequenceRequestOrdersPublisher extends Publisher<SequenceRequestOrdersEvent> {
  topic: Topics.SequenceRequestOrders = Topics.SequenceRequestOrders;
}
