import { Message } from 'kafka-node';
import { Listener } from '../base-listener';
import { Topics } from '../topics';
import { ApiAccessUpdatedEvent } from '../api-access-updated-event';
import { consumerGroupID } from './consumer-group-id';

export class ApiAccessUpdatedListener extends Listener<ApiAccessUpdatedEvent> {
  topic: Topics.ApiAccessUpdated = Topics.ApiAccessUpdated;
  consumerGroupID = consumerGroupID;

  async onMessage(data: ApiAccessUpdatedEvent['data'], msg: Message) {
    console.log(
      `= ApiAccessUpdatedListener onMessage = consumerGroupID${this.consumerGroupID}, topic: ${msg.topic}, partition: ${msg.partition}, offset: ${msg.offset} - data:`,
      data
    );
  }
}
