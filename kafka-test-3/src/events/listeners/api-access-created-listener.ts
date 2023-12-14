import { Message } from 'kafka-node';
import { Listener, Topics, ApiAccessCreatedEvent } from '@orbitelco/common';
import { consumerGroupID } from './consumer-group-id';
// import { ApiAccess } from '../../models/api-access-model';
// import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class ApiAccessCreatedListener extends Listener<ApiAccessCreatedEvent> {
  topic: Topics.ApiAccessCreated = Topics.ApiAccessCreated;
  consumerGroupID = consumerGroupID;

  async onMessage(data: ApiAccessCreatedEvent['data'], msg: Message) {
    console.log(
      `= ApiAccessCreatedListener onMessage = consumerGroupID${this.consumerGroupID}, topic: ${msg.topic}, partition: ${msg.partition}, offset: ${msg.offset} - data:`,
      data
    );
  }
}
