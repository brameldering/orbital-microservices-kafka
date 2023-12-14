import { Publisher } from '../base-publisher';
import { Topics } from '../topics';
import { ApiAccessUpdatedEvent } from '../api-access-updated-event';

export class ApiAccessUpdatedPublisher extends Publisher<ApiAccessUpdatedEvent> {
  topic: Topics.ApiAccessUpdated = Topics.ApiAccessUpdated;
}
