import React, { ReactNode } from 'react';
import { Alert } from 'react-bootstrap';

interface ISerializedError {
  message: string;
  field?: string;
}

const ErrorBlock = ({ error }: { error: any }): ReactNode => {
  let errorBlock: ReactNode;
  if (error.data?.errors) {
    // Our custom error
    errorBlock = (
      <Alert className='mt-3' variant='danger'>
        <ul className='my-0 list-unstyled'>
          {error.data.errors.map((err: ISerializedError) => (
            <li key={err.message}>{err.message}</li>
          ))}
        </ul>
      </Alert>
    );
  } else if (error.message) {
    // Axios error
    console.log('error: ', error.message);
    errorBlock = (
      <Alert className='mt-3' variant='danger'>
        {error.message}
      </Alert>
    );
  } else if (error.request) {
    // Axios error
    console.log('error: ', error.request.toString());
    errorBlock = (
      <Alert className='mt-3' variant='danger'>
        Network Error
      </Alert>
    );
  } else {
    // Other errors
    const errorMessage = error.message | error.toString();
    errorBlock = (
      <Alert className='mt-3' variant='danger'>
        {errorMessage}
      </Alert>
    );
  }
  return errorBlock;
};

export default ErrorBlock;