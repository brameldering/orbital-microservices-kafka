import {
  Listener,
  Topics,
  ApiAccessUpdatedEvent,
  ApiAccess,
  apiAccessCache,
} from '@orbitelco/common';
import { consumerGroupID } from './consumer-group-id';

export class ApiAccessUpdatedListener extends Listener<ApiAccessUpdatedEvent> {
  topic: Topics.ApiAccessUpdated = Topics.ApiAccessUpdated;
  consumerGroupID = consumerGroupID;

  async onMessage(data: ApiAccessUpdatedEvent['data']) {
    console.log(
      `= products.ApiAccessUpdatedListener = consumerGroupID${this.consumerGroupID}, topic: ${this.topic} - data:`,
      data
    );

    // const apiAccess = await ApiAccess.findById(data.id);
    const apiAccess = await ApiAccess.findOne({ apiName: data.apiName });

    // If no apiAccess record, throw error
    if (!apiAccess) {
      throw new Error('products ApiAccess record not found');
    }

    // Update the allowedRoles property
    apiAccess.set({ allowedRoles: data.allowedRoles });

    // Save the apiAccess record
    await apiAccess.save();

    // Refresh ApiAccessArray cache
    await apiAccessCache.loadCacheFromDB();
  }
}
