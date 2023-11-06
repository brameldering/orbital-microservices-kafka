import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FormContainer from '../form/FormContainer';
import Meta from '../components/Meta';

const NotFound: React.FunctionComponent = () => {
  const router = useRouter();

  return (
    <FormContainer>
      <Meta title='Page not found' />
      <h1>Oops! </h1>
      <p>
        <strong>The requested page </strong>({router.pathname})
        <strong> does not exist.</strong>
      </p>
      <p></p>
      <Link href='/'>Go to home page</Link>
    </FormContainer>
  );
};

export default NotFound;
