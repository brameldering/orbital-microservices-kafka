import { Publisher, Topics, ApiAccessDeletedEvent } from '@orbital_app/common';

export class ApiAccessDeletedPublisher extends Publisher<ApiAccessDeletedEvent> {
  topic: Topics.ApiAccessDeleted = Topics.ApiAccessDeleted;
}
