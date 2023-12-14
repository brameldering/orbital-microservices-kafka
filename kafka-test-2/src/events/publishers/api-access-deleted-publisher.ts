import { Publisher } from '../base-publisher';
import { Topics } from '../topics';
import { ApiAccessDeletedEvent } from '../api-access-deleted-event';

export class ApiAccessDeletedPublisher extends Publisher<ApiAccessDeletedEvent> {
  topic: Topics.ApiAccessDeleted = Topics.ApiAccessDeleted;
}
