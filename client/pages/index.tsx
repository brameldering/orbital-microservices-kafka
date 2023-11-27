import React from 'react';
import Link from 'next/link';
import Meta from 'components/Meta';

import { PRODUCTS_PAGE } from 'constants/client-pages';

const HomePage: React.FC = () => {
  return (
    <>
      <Meta title='Orbitelco' />
      <h1>Menu</h1>
      <Link id='LINK_products_page' href={PRODUCTS_PAGE}>
        Orbitelco Shop
      </Link>
    </>
  );
};

export default HomePage;
