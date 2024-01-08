import {
  Listener,
  Topics,
  ApiAccessDeletedEvent,
  ApiAccess,
  apiAccessCache,
  ApplicationIntegrityError,
  ApplicationServerError,
} from '@orbitelco/common';

export class ApiAccessDeletedListener extends Listener<ApiAccessDeletedEvent> {
  topic: Topics.ApiAccessDeleted = Topics.ApiAccessDeleted;

  async onMessage(key: string, data: ApiAccessDeletedEvent['data']) {
    try {
      const apiAccess = await ApiAccess.findOne({ apiName: data.apiName });

      // If no apiAccess record, throw error
      if (!apiAccess) {
        throw new ApplicationIntegrityError(
          'Products - ApiAccess record not found'
        );
      }

      // Update the ApiAccess record
      apiAccess.deleteOne({ _id: data.id });

      // Refresh ApiAccesscache
      await apiAccessCache.loadCacheFromDB();
    } catch (error: any) {
      console.error(
        `Error in ApiAccessDeletedListener for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
