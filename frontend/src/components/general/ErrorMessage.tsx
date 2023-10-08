import React from 'react';
import { Alert } from 'react-bootstrap';

import {
  IError,
  IStandardError,
  IErrorWithStatusAndData,
} from '../../types/errorTypes';

import ErrorBlock from './ErrorBlock';

// Check if the error object is a 'standard' error (IStandardError) with error.message
const isStandardError = (error: unknown): error is IStandardError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
};

// Check if the error object is an error coming from the backend HTTP APIs (IErrorWithStatusAndData)
// with structure error.status, error.data.message (and optionally error.data.stack)
const isErrorWithStatusAndData = (
  error: unknown
): error is IErrorWithStatusAndData => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    error.status !== null &&
    'data' in error &&
    error.data !== null &&
    typeof error.data === 'object' &&
    'message' in error.data &&
    error.data.message !== null
  );
};

// Create IError object from either IStandardError or IErrorWithStatusAndData
const deriveErrorData = (error: unknown): IError => {
  const errorObject: IError = { status: 0, message: '', stack: '' };
  try {
    if (isErrorWithStatusAndData(error)) {
      errorObject.status = error.status;
      errorObject.message = error.data.message;
      errorObject.stack = error.data.stack || '';
    } else if (isStandardError(error)) {
      errorObject.status = 0;
      errorObject.message = error.message;
      errorObject.stack = error.stack || '';
    }
  } catch {
    // fallback in case there's an error stringifying the Error
    errorObject.status = 0;
    errorObject.message = String(error);
    errorObject.stack = '';
  }
  return errorObject;
};

interface ErrorMessageProps {
  error: any;
}

const ErrorMessage: React.FunctionComponent<ErrorMessageProps> = ({
  error,
}) => {
  const errorObject = deriveErrorData(error);
  // TO DO: Log Frontend Error using an API to the backend
  return (
    <>
      {!isNaN(errorObject.status) && errorObject.status < 500 ? (
        <Alert id='alert_error' variant='danger'>
          {errorObject.message}
        </Alert>
      ) : (
        <ErrorBlock errorMessage={errorObject.message} />
      )}
    </>
  );
};

export default ErrorMessage;
