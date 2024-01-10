import React from 'react';
import Link from 'next/link';
import FormTitle from 'form/FormTitle';
import FormContainer from 'form/FormContainer';
import Meta from 'components/Meta';
import PAGES from 'constants/client-pages';

const NotFound: React.FC = () => {
  return (
    <FormContainer>
      <Meta title='Page not found' />
      <FormTitle>Oops! </FormTitle>
      <p>
        <strong>The requested page does not exist.</strong>
      </p>
      <p></p>
      <Link href={PAGES.INDEX_PAGE}>Go to home page</Link>
    </FormContainer>
  );
};

export default NotFound;
