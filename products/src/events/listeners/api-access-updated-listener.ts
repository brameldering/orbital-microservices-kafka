import { Message } from 'kafka-node';
import {
  Listener,
  Topics,
  ApiAccessUpdatedEvent,
  // ApiAccess,
} from '@orbitelco/common';
import { consumerGroupID } from './consumer-group-id';

export class ApiAccessUpdatedListener extends Listener<ApiAccessUpdatedEvent> {
  topic: Topics.ApiAccessUpdated = Topics.ApiAccessUpdated;
  consumerGroupID = consumerGroupID;

  async onMessage(data: ApiAccessUpdatedEvent['data'], msg: Message) {
    console.log(
      `= products.ApiAccessUpdatedListener = consumerGroupID${this.consumerGroupID}, topic: ${msg.topic}, partition: ${msg.partition}, offset: ${msg.offset} - data:`,
      data
    );

    // const apiAccess = await ApiAccess.findById(data.id);

    // // If no apiAccess record, throw error
    // if (!apiAccess) {
    //   throw new Error('products ApiAccess record not found');
    // }

    // // Update the allowedRoles property
    // apiAccess.set({ allowedRoles: data.allowedRoles });

    // // Save the apiAccess record
    // await apiAccess.save();
  }
}
