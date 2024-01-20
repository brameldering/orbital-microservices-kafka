import {
  Listener,
  Topics,
  ApiAccessUpdatedEvent,
  ApiAccess,
  apiAccessCache,
  ApplicationIntegrityError,
  ApplicationServerError,
  MICROSERVICE_PRODUCTS,
} from '@orbital_app/common';

export class ApiAccessUpdatedListener extends Listener<ApiAccessUpdatedEvent> {
  topic: Topics.ApiAccessUpdated = Topics.ApiAccessUpdated;

  async onMessage(key: string, data: ApiAccessUpdatedEvent['data']) {
    try {
      const { apiName, microservice, allowedRoles } = data;

      // Check that this ApiAccessUpdatedEvent is relevant for the Products Microservice
      if (microservice === MICROSERVICE_PRODUCTS) {
        const apiAccess = await ApiAccess.findOne({ apiName });

        // If no apiAccess record found, throw error
        if (!apiAccess) {
          throw new ApplicationIntegrityError(
            'Products - ApiAccess record not found'
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
