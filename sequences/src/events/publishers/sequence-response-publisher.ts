import { Publisher, Topics, SequenceResponseEvent } from '@orbitelco/common';

export class SequenceResponsePublisher extends Publisher<SequenceResponseEvent> {
  topic: Topics.SequenceResponse = Topics.SequenceResponse;
}
