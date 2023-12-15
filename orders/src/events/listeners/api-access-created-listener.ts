import { Message } from 'kafka-node';
import {
  Listener,
  Topics,
  ApiAccessCreatedEvent,
  ApiAccess,
} from '@orbitelco/common';
import { consumerGroupID } from './consumer-group-id';

export class ApiAccessCreatedListener extends Listener<ApiAccessCreatedEvent> {
  topic: Topics.ApiAccessCreated = Topics.ApiAccessCreated;
  consumerGroupID = consumerGroupID;

  async onMessage(data: ApiAccessCreatedEvent['data'], msg: Message) {
    console.log(
      `= orders.ApiAccessCreatedListener = consumerGroupID${this.consumerGroupID}, topic: ${msg.topic}, partition: ${msg.partition}, offset: ${msg.offset} - data:`,
      data
    );
    const { id, microservice, apiName, allowedRoles } = data;

    const apiAccess = ApiAccess.build({
      id,
      microservice,
      apiName,
      allowedRoles,
    });

    console.log('orders ApiAccess.build: ', apiAccess);

    await apiAccess.save();
  }
}
