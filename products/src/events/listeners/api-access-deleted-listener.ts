import {
  Listener,
  Topics,
  ApiAccessDeletedEvent,
  ApiAccess,
} from '@orbitelco/common';
import { updateApiAccessCache } from '../../utils/apiAccessArrayManager';
import { consumerGroupID } from './consumer-group-id';

export class ApiAccessDeletedListener extends Listener<ApiAccessDeletedEvent> {
  topic: Topics.ApiAccessDeleted = Topics.ApiAccessDeleted;
  consumerGroupID = consumerGroupID;

  async onMessage(data: ApiAccessDeletedEvent['data']) {
    console.log(
      `= products.ApiAccessDeletedListener = consumerGroupID${this.consumerGroupID}, topic: ${this.topic} - data:`,
      data
    );

    // const apiAccess = await ApiAccess.findById(data.id);
    const apiAccess = await ApiAccess.findOne({ apiName: data.apiName });

    // If no apiAccess record, throw error
    if (!apiAccess) {
      throw new Error('products ApiAccess record not found');
    }

    // Update the ApiAccess record
    apiAccess.deleteOne({ _id: data.id });

    // Refresh ApiAccessArray cache
    await updateApiAccessCache();
  }
}
