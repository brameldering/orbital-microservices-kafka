import { Publisher, Topics, SequenceRequestEvent } from '@orbitelco/common';

export class SequenceRequestPublisher extends Publisher<SequenceRequestEvent> {
  topic: Topics.SequenceRequest = Topics.SequenceRequest;
}
