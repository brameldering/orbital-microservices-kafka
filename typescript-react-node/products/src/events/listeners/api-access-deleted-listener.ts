import {
  Listener,
  Topics,
  ApiAccessDeletedEvent,
  ApiAccess,
  apiAccessCache,
  ApplicationIntegrityError,
  ApplicationServerError,
  MICROSERVICE_PRODUCTS,
} from '@orbital_app/common';

export class ApiAccessDeletedListener extends Listener<ApiAccessDeletedEvent> {
  topic: Topics.ApiAccessDeleted = Topics.ApiAccessDeleted;

  async onMessage(key: string, data: ApiAccessDeletedEvent['data']) {
    try {
      const { id, apiName, microservice } = data;

      // Check that this ApiAccessDeletedEvent is relevant for the Products Microservice
      if (microservice === MICROSERVICE_PRODUCTS) {
        const apiAccess = await ApiAccess.findOne({ apiName });

        // If no apiAccess record, throw error
        if (!apiAccess) {
          throw new ApplicationIntegrityError(
            'Products - ApiAccess record not found'
          );
        }

        // Update the ApiAccess record
        apiAccess.deleteOne({ _id: id });

        // Refresh ApiAccesscache
        await apiAccessCache.loadCacheFromDB();
        console.log('Updated apiAccess');
      }
    } catch (error: any) {
      console.error(
        `Error in ApiAccessDeletedListener for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
