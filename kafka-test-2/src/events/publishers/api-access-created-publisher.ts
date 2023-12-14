import { Publisher } from '../base-publisher';
import { Topics } from '../topics';
import { ApiAccessCreatedEvent } from '../api-access-created-event';

export class ApiAccessCreatedPublisher extends Publisher<ApiAccessCreatedEvent> {
  topic: Topics.ApiAccessCreated = Topics.ApiAccessCreated;
}
