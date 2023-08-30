import Message from './Message';

const ErrorMessage = ({ error }) => {
  return (
    <Message variant='danger'>{error?.data?.message || error?.error}</Message>
  );
};

export default ErrorMessage;
