import {
  Publisher,
  Topics,
  SequenceResponseOrdersEvent,
} from '@orbital_app/common';

export class SequenceResponseOrdersPublisher extends Publisher<SequenceResponseOrdersEvent> {
  topic: Topics.SequenceResponseOrders = Topics.SequenceResponseOrders;
}
