import React, { ReactNode } from 'react';
import { Alert } from 'react-bootstrap';
import ErrorBlock from './ErrorBlock';
// import { ErrorType } from '../../types/errorTypes';
// import { PayloadAction } from '@reduxjs/toolkit';

interface MessageProps {
  variant: string;
  children: ReactNode;
}

interface ErrorMessageProps {
  error: any;
}

const Message: React.FunctionComponent<MessageProps> = ({
  variant,
  children,
}) => {
  return <Alert variant={variant}>{children}</Alert>;
};

const ErrorMessage: React.FunctionComponent<ErrorMessageProps> = ({
  error,
}) => {
  return (
    <>
      {error.status < 500 && !isNaN(error.status) ? (
        <Message variant='danger'>
          {error?.data?.message || error?.error}
        </Message>
      ) : (
        <ErrorBlock error={error} />
      )}
    </>
  );
};

export { Message, ErrorMessage };
