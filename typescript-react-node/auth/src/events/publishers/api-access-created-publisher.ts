import { Publisher, Topics, ApiAccessCreatedEvent } from '@orbital_app/common';

export class ApiAccessCreatedPublisher extends Publisher<ApiAccessCreatedEvent> {
  topic: Topics.ApiAccessCreated = Topics.ApiAccessCreated;
}
