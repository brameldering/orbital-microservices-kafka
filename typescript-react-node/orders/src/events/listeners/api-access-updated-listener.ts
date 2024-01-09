import {
  Listener,
  Topics,
  ApiAccessUpdatedEvent,
  ApiAccess,
  apiAccessCache,
  ApplicationIntegrityError,
  ApplicationServerError,
  MICROSERVICE_ORDERS,
} from '@orbitelco/common';

export class ApiAccessUpdatedListener extends Listener<ApiAccessUpdatedEvent> {
  topic: Topics.ApiAccessUpdated = Topics.ApiAccessUpdated;

  async onMessage(key: string, data: ApiAccessUpdatedEvent['data']) {
    try {
      const { microservice, apiName, allowedRoles } = data;

      // Check that this ApiAccessUpdatedEvent is relevant for the Orders Microservice
      if (microservice === MICROSERVICE_ORDERS) {
        const apiAccess = await ApiAccess.findOne({ apiName });

        // If no apiAccess record, throw error
        if (!apiAccess) {
          throw new ApplicationIntegrityError(
            'Orders - ApiAccess record not found'
          );
        }

        // Update the allowedRoles property
        apiAccess.set({ allowedRoles });

        // Save the apiAccess record
        await apiAccess.save();

        // Refresh ApiAccessArray cache
        await apiAccessCache.loadCacheFromDB();
        console.log('Updated apiAccess');
      }
    } catch (error: any) {
      console.error(
        `Error in ApiAccessUpdatedListener for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
