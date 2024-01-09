import {
  Listener,
  Topics,
  ApiAccessCreatedEvent,
  ApiAccess,
  apiAccessCache,
  ApplicationServerError,
  MICROSERVICE_PRODUCTS,
} from '@orbitelco/common';

export class ApiAccessCreatedListener extends Listener<ApiAccessCreatedEvent> {
  topic: Topics.ApiAccessCreated = Topics.ApiAccessCreated;

  async onMessage(key: string, data: ApiAccessCreatedEvent['data']) {
    try {
      const { id, microservice, apiName, allowedRoles } = data;

      // Check that this ApiAccessCreatedEvent is relevant for the Products Microservice
      if (microservice === MICROSERVICE_PRODUCTS) {
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
    } catch (error: any) {
      console.error(
        `Error in ApiAccessCreatedListener for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
