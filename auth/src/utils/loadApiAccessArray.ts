import { ApiAccess } from '@orbitelco/common';

export const getApiAccessArray = async () => {
  // ======= api access authorization logic =========
  // Load API access rights in array
  const apiAccessArrayOriginal = await ApiAccess.find({});
  // map users to json format as defined in user-types userSchema
  const apiAccessArray = apiAccessArrayOriginal.map(
    (apiAccess: { toJSON: () => any }) => apiAccess.toJSON()
  );
  console.log('apiAccessArray: ', apiAccessArray);
  return apiAccessArray;
};
