import { Publisher, Topics, ApiAccessCreatedEvent } from '@orbitelco/common';

export class ApiAccessCreatedPublisher extends Publisher<ApiAccessCreatedEvent> {
  topic: Topics.ApiAccessCreated = Topics.ApiAccessCreated;
}
