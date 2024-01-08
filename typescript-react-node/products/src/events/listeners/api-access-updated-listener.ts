import {
  Listener,
  Topics,
  ApiAccessUpdatedEvent,
  ApiAccess,
  apiAccessCache,
  ApplicationIntegrityError,
  ApplicationServerError,
} from '@orbitelco/common';

export class ApiAccessUpdatedListener extends Listener<ApiAccessUpdatedEvent> {
  topic: Topics.ApiAccessUpdated = Topics.ApiAccessUpdated;

  async onMessage(key: string, data: ApiAccessUpdatedEvent['data']) {
    try {
      const apiAccess = await ApiAccess.findOne({ apiName: data.apiName });

      // If no apiAccess record, throw error
      if (!apiAccess) {
        throw new ApplicationIntegrityError(
          'Products - ApiAccess record not found'
        );
      }

      // Update the allowedRoles property
      apiAccess.set({ allowedRoles: data.allowedRoles });

      // Save the apiAccess record
      await apiAccess.save();

      // Refresh ApiAccessArray cache
      await apiAccessCache.loadCacheFromDB();
    } catch (error: any) {
      console.error(
        `Error in ApiAccessUpdatedListener for topic ${this.topic}:`,
        error
      );
      throw new ApplicationServerError(error.toString());
    }
  }
}
