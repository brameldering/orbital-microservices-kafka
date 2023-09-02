import { Alert } from 'react-bootstrap';

const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

const ErrorMessage = ({ error }) => {
  return (
    <Message variant='danger'>{error?.data?.message || error?.error}</Message>
  );
};

export { Message, ErrorMessage };
