import {
  Listener,
  Topics,
  ApiAccessDeletedEvent,
  ApiAccess,
  apiAccessCache,
  ApplicationIntegrityError,
  ApplicationServerError,
  MICROSERVICE_ORDERS,
} from '@orbitelco/common';

export class ApiAccessDeletedListener extends Listener<ApiAccessDeletedEvent> {
  topic: Topics.ApiAccessDeleted = Topics.ApiAccessDeleted;

  async onMessage(key: string, data: ApiAccessDeletedEvent['data']) {
    try {
      const { id, microservice, apiName } = data;

      // Check that this ApiAccessDeletedEvent is relevant for the Orders Microservice
      if (microservice === MICROSERVICE_ORDERS) {
        const apiAccess = await ApiAccess.findOne({ apiName });

        // If no apiAccess record, throw error
        if (!apiAccess) {
          throw new ApplicationIntegrityError(
            'Orders - ApiAccess record not found'
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
