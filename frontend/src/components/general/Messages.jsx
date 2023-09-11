import { Alert } from 'react-bootstrap';
import ErrorBlock from './ErrorBlock';

const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

const ErrorMessage = ({ error }) => {
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
