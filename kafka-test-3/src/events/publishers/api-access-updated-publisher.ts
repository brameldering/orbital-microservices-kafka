import { Publisher, Topics, ApiAccessUpdatedEvent } from '@orbitelco/common';

export class ApiAccessUpdatedPublisher extends Publisher<ApiAccessUpdatedEvent> {
  topic: Topics.ApiAccessUpdated = Topics.ApiAccessUpdated;
}
