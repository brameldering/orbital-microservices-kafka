import { Message } from 'kafka-node';
import { Listener } from '../base-listener';
import { Topics } from '../topics';
import { ApiAccessDeletedEvent } from '../api-access-deleted-event';
import { consumerGroupID } from './consumer-group-id';

export class ApiAccessDeletedListener extends Listener<ApiAccessDeletedEvent> {
  topic: Topics.ApiAccessDeleted = Topics.ApiAccessDeleted;
  consumerGroupID = consumerGroupID;

  async onMessage(data: ApiAccessDeletedEvent['data'], msg: Message) {
    console.log(
      `= ApiAccessDeletedListener onMessage = consumerGroupID${this.consumerGroupID}, topic: ${msg.topic}, partition: ${msg.partition}, offset: ${msg.offset} - data:`,
      data
    );
  }
}
