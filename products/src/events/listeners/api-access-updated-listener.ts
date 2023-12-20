import {
  Listener,
  Topics,
  ApiAccessUpdatedEvent,
  ApiAccess,
  apiAccessCache,
} from '@orbitelco/common';

export class ApiAccessUpdatedListener extends Listener<ApiAccessUpdatedEvent> {
  topic: Topics.ApiAccessUpdated = Topics.ApiAccessUpdated;

  async onMessage(data: ApiAccessUpdatedEvent['data']) {
    try {
      const apiAccess = await ApiAccess.findOne({ apiName: data.apiName });

      // If no apiAccess record, throw error
      if (!apiAccess) {
        throw new Error('Products - ApiAccess record not found');
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
    }
  }
}
