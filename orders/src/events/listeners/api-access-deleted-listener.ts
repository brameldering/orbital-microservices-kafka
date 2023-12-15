import { Message } from 'kafka-node';
import {
  Listener,
  Topics,
  ApiAccessDeletedEvent,
  ApiAccess,
} from '@orbitelco/common';
import { consumerGroupID } from './consumer-group-id';

export class ApiAccessDeletedListener extends Listener<ApiAccessDeletedEvent> {
  topic: Topics.ApiAccessDeleted = Topics.ApiAccessDeleted;
  consumerGroupID = consumerGroupID;

  async onMessage(data: ApiAccessDeletedEvent['data'], msg: Message) {
    console.log(
      `= orders.ApiAccessDeletedListener = consumerGroupID${this.consumerGroupID}, topic: ${msg.topic}, partition: ${msg.partition}, offset: ${msg.offset} - data:`,
      data
    );

    const apiAccess = await ApiAccess.findById(data.id);

    // If no apiAccess record, throw error
    if (!apiAccess) {
      throw new Error('orders ApiAccess record not found');
    }

    // Update the ApiAccess record
    apiAccess.deleteOne({ _id: data.id });
  }
}
