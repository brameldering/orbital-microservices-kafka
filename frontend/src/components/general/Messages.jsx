import { Alert } from 'react-bootstrap';
import ErrorBlock from './ErrorBlock';

const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

const ErrorMessage = ({ error }) => {
  return (
    <>
      {error.status < 500 ? (
        <Message variant='danger'>{error.data?.message}</Message>
      ) : (
        <ErrorBlock error={error} />
      )}
    </>
  );
};

export { Message, ErrorMessage };
