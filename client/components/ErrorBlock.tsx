import React, { ReactNode } from 'react';
import { Alert } from 'react-bootstrap';

interface ISerializedError {
  message: string;
  field?: string;
}

interface AlertWithStylingProps {
  children: ReactNode;
}

const AlertWithStyling: React.FunctionComponent<AlertWithStylingProps> = ({
  children,
}) => {
  return (
    <Alert className='mt-3 mb-0' variant='danger' id='error_message'>
      {children}
    </Alert>
  );
};

const ErrorBlock = ({ error }: { error: any }): ReactNode => {
  let errorBlock: ReactNode;
  if (error.data?.errors) {
    // Our custom error
    errorBlock = (
      <AlertWithStyling>
        <ul className='my-0 list-unstyled'>
          {error.data.errors.map((err: ISerializedError) => (
            <li key={err.message}>{err.message}</li>
          ))}
        </ul>
      </AlertWithStyling>
    );
  } else if (error.message) {
    // Axios error
    console.error('error: ', error.message);
    errorBlock = <AlertWithStyling>{error.message}</AlertWithStyling>;
  } else if (error.request) {
    // Axios error
    console.error('error: ', error.request.toString());
    errorBlock = <AlertWithStyling>Network Error</AlertWithStyling>;
  } else {
    // Other errors
    const errorMessage = error.toString();
    errorBlock = <AlertWithStyling>{errorMessage}</AlertWithStyling>;
  }
  return errorBlock;
};

export default ErrorBlock;
