import {
  Publisher,
  Topics,
  SequenceRequestProductsEvent,
} from '@orbital_app/common';

export class SequenceRequestProductsPublisher extends Publisher<SequenceRequestProductsEvent> {
  topic: Topics.SequenceRequestProducts = Topics.SequenceRequestProducts;
}
