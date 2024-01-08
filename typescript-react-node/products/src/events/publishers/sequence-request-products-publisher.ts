import {
  Publisher,
  Topics,
  SequenceRequestProductsEvent,
} from '@orbitelco/common';

export class SequenceRequestProductsPublisher extends Publisher<SequenceRequestProductsEvent> {
  topic: Topics.SequenceRequestProducts = Topics.SequenceRequestProducts;
}
