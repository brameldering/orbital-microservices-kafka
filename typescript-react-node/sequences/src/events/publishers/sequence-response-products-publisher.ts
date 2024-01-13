import {
  Publisher,
  Topics,
  SequenceResponseProductsEvent,
} from '@orbital_app/common';

export class SequenceResponseProductsPublisher extends Publisher<SequenceResponseProductsEvent> {
  topic: Topics.SequenceResponseProducts = Topics.SequenceResponseProducts;
}
