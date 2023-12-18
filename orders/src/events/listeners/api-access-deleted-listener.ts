import { Kafka } from 'kafkajs';
import {
  Listener,
  Topics,
  ApiAccessDeletedEvent,
  ApiAccess,
  apiAccessCache,
} from '@orbitelco/common';
import { consumerGroupID } from './consumer-group-id';

export class ApiAccessDeletedListener extends Listener<ApiAccessDeletedEvent> {
  topic: Topics.ApiAccessDeleted = Topics.ApiAccessDeleted;

  constructor(client: Kafka) {
    super(client, consumerGroupID);
  }

  async onMessage(data: ApiAccessDeletedEvent['data']) {
    console.log(
      `Orders - ApiAccessCreatedListener: consumerGroupID${this.consumerGroupID}, topic: ${this.topic} - data:`,
      data
    );

    const apiAccess = await ApiAccess.findOne({ apiName: data.apiName });

    // If no apiAccess record, throw error
    if (!apiAccess) {
      throw new Error('Orders - ApiAccess record not found');
    }

    // Update the ApiAccess record
    apiAccess.deleteOne({ _id: data.id });

    // Refresh ApiAccesscache
    await apiAccessCache.loadCacheFromDB();
  }
}
