import { Publisher, Topics, ApiAccessDeletedEvent } from '@orbitelco/common';

export class ApiAccessDeletedPublisher extends Publisher<ApiAccessDeletedEvent> {
  topic: Topics.ApiAccessDeleted = Topics.ApiAccessDeleted;
}
