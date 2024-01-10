import React from 'react';
import Link from 'next/link';
import Meta from 'components/Meta';
import FormTitle from 'form/FormTitle';

import PAGES from 'constants/client-pages';

const HomePage: React.FC = () => {
  return (
    <>
      <Meta title='Orbitelco' />
      <FormTitle>Menu</FormTitle>
      <Link id='LINK_products_page' href={PAGES.PRODUCTS_PAGE}>
        Orbitelco Shop
      </Link>
    </>
  );
};

export default HomePage;
