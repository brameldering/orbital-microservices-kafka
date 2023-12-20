import { Listener, Topics, ApiAccessCreatedEvent } from '@orbitelco/common';

export class ApiAccessCreatedListener extends Listener<ApiAccessCreatedEvent> {
  topic: Topics.ApiAccessCreated = Topics.ApiAccessCreated;

  async onMessage(data: ApiAccessCreatedEvent['data']) {
    try {
      console.log(
        `Products - ApiAccessCreatedListener topic: ${this.topic} - data:`,
        data
      );
    } catch (error: any) {
      console.error(
        `Error in ApiAccessCreatedListener for topic ${this.topic}:`,
        error
      );
    }
  }
}
