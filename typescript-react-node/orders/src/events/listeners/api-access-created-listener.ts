import {
  Listener,
  Topics,
  ApiAccessCreatedEvent,
  ApiAccess,
  apiAccessCache,
  ApplicationServerError,
  MICROSERVICE_ORDERS,
} from '@orbitelco/common';

export class ApiAccessCreatedListener extends Listener<ApiAccessCreatedEvent> {
  topic: Topics.ApiAccessCreated = Topics.ApiAccessCreated;

  async onMessage(key: string, data: ApiAccessCreatedEvent['data']) {
    try {
      const { id, apiName, microservice, allowedRoles } = data;

      // Check that this ApiAccessCreatedEvent is relevant for the Orders Microservice
      if (microservice === MICROSERVICE_ORDERS) {
        const apiAccess = ApiAccess.build({
          id,
          apiName,
          microservice,
          allowedRoles,
        });

        await apiAccess.save();

        // Refresh ApiAccess cache
        await apiAccessCache.loadCacheFromDB();
        console.log('Updated apiAccess');
      }
    } catch (error: any) {
      console.error(
        `Error in ApiAccessCreatedListener for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
