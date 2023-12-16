import { ApiAccess, IApiAccessAttrs } from '@orbitelco/common';

let apiAccessCache: IApiAccessAttrs[] = [];

export async function updateApiAccessCache() {
  try {
    // Fetch the latest data from MongoDB
    // Load API access rights in original format array
    const apiAccessArrayOriginal = await ApiAccess.find({});
    // map records to json format as defined in apiAccessSchema
    apiAccessCache = apiAccessArrayOriginal.map(
      (apiAccess: { toJSON: () => any }) => apiAccess.toJSON()
    );
    console.log('ApiAccessArray updated.');
  } catch (error) {
    console.error('Error updating API Access Array:', error);
  }
}

export function getCurrentApiAccessArray() {
  return apiAccessCache; // Return the current state of the array
}

// Fetch initial data at module import, such as server start
updateApiAccessCache();
