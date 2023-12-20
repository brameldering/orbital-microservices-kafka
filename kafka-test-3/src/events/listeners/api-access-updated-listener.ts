import { Listener, Topics, ApiAccessUpdatedEvent } from '@orbitelco/common';

export class ApiAccessUpdatedListener extends Listener<ApiAccessUpdatedEvent> {
  topic: Topics.ApiAccessUpdated = Topics.ApiAccessUpdated;

  async onMessage(data: ApiAccessUpdatedEvent['data']) {
    try {
      console.log(
        `Products - ApiAccessUpdatedListener topic: ${this.topic} - data:`,
        data
      );
    } catch (error: any) {
      console.error(
        `Error in ApiAccessUpdatedListener for topic ${this.topic}:`,
        error
      );
    }
  }
}
