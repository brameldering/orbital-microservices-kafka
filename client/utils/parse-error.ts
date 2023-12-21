export const parseError = (error: any) => {
  let errorObj: any;
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error('error.response.status', error.response.status); // This will show the status code
    errorObj = { data: error.response.data };
    console.error('error.response.data', errorObj); // This will show the full response data
  } else if (error.request) {
    // The request was made but no response was received
    errorObj = { request: error.request };
    console.error('error.request', errorObj);
  } else {
    // Something happened in setting up the request that triggered an Error
    errorObj = { message: error.message };
    console.error('Unknown error.message', errorObj);
  }
  return errorObj;
};
