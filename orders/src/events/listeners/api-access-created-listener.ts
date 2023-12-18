import { Kafka } from 'kafkajs';
import {
  Listener,
  Topics,
  ApiAccessCreatedEvent,
  ApiAccess,
  apiAccessCache,
} from '@orbitelco/common';
import { consumerGroupID } from './consumer-group-id';

export class ApiAccessCreatedListener extends Listener<ApiAccessCreatedEvent> {
  topic: Topics.ApiAccessCreated = Topics.ApiAccessCreated;

  constructor(client: Kafka) {
    super(client, consumerGroupID);
  }

  async onMessage(data: ApiAccessCreatedEvent['data']) {
    console.log(
      `Orders - ApiAccessCreatedListener: consumerGroupID${this.consumerGroupID}, topic: ${this.topic} - data:`,
      data
    );
    const { id, microservice, apiName, allowedRoles } = data;

    const apiAccess = ApiAccess.build({
      id,
      microservice,
      apiName,
      allowedRoles,
    });

    await apiAccess.save();

    // Refresh ApiAccess cache
    await apiAccessCache.loadCacheFromDB();
  }
}
