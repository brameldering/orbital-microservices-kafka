import {
  Listener,
  Topics,
  ApiAccessCreatedEvent,
  ApiAccess,
  apiAccessCache,
} from '@orbitelco/common';

export class ApiAccessCreatedListener extends Listener<ApiAccessCreatedEvent> {
  topic: Topics.ApiAccessCreated = Topics.ApiAccessCreated;

  async onMessage(data: ApiAccessCreatedEvent['data']) {
    try {
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
    } catch (error: any) {
      console.error(
        `Error in ApiAccessCreatedListener for topic ${this.topic}:`,
        error
      );
    }
  }
}
