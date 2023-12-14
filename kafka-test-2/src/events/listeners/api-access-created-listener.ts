import { Message } from 'kafka-node';
import { Listener } from '../base-listener';
import { Topics } from '../topics';
import { ApiAccessCreatedEvent } from '../api-access-created-event';
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
