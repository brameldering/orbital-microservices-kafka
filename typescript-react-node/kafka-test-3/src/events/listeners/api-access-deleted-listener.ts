import { Listener, Topics, ApiAccessDeletedEvent } from '@orbitelco/common';

export class ApiAccessDeletedListener extends Listener<ApiAccessDeletedEvent> {
  topic: Topics.ApiAccessDeleted = Topics.ApiAccessDeleted;

  async onMessage(data: ApiAccessDeletedEvent['data']) {
    try {
      console.log(
        `Products - ApiAccessDeletedListener topic: ${this.topic} - data:`,
        data
      );
    } catch (error: any) {
      console.error(
        `Error in ApiAccessDeletedListener for topic ${this.topic}:`,
        error
      );
    }
  }
}
