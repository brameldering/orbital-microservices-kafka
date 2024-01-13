import { Publisher, Topics, ApiAccessUpdatedEvent } from '@orbital_app/common';

export class ApiAccessUpdatedPublisher extends Publisher<ApiAccessUpdatedEvent> {
  topic: Topics.ApiAccessUpdated = Topics.ApiAccessUpdated;
}
