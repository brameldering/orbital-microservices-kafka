import { ApiAccess, IApiAccessAttrs, DatabaseError } from '@orbitelco/common';

class ApiAccessCache {
  private _apiAccessCacheData?: IApiAccessAttrs[];

  get cache() {
    if (!this._apiAccessCacheData) {
      throw new Error(
        'Cache data is empty, initialize data first using updateCache'
      );
    }
    return this._apiAccessCacheData;
  }

  // Fetch the data from MongoDB
  async loadCacheFromDB() {
    try {
      // Load API access rights in original format array
      const apiAccessDataOriginal = await ApiAccess.find({});
      // map records to json format as defined in apiAccessSchema
      this._apiAccessCacheData = apiAccessDataOriginal.map(
        (apiAccess: { toJSON: () => any }) => apiAccess.toJSON()
      );
    } catch (error) {
      console.error('Error loading API Access Data:', error);
      throw new DatabaseError('Error loading API Access Data');
    }
  }
}

export const apiAccessCache = new ApiAccessCache();
