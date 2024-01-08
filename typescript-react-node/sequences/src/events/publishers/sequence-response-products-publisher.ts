import {
  Publisher,
  Topics,
  SequenceResponseProductsEvent,
} from '@orbitelco/common';

export class SequenceResponseProductsPublisher extends Publisher<SequenceResponseProductsEvent> {
  topic: Topics.SequenceResponseProducts = Topics.SequenceResponseProducts;
}
