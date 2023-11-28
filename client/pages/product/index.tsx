import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import Paginate from 'components/Paginate';
import ProductComponent from 'components/ProductComponent';
import { H1_PRODUCTS } from 'constants/form-titles';
import { IProduct, ADMIN_ROLE } from '@orbitelco/common';
import { PRODUCTS_PAGE } from 'constants/client-pages';
import type { RootState } from 'slices/store';
import { useGetProductsQuery } from 'slices/productsApiSlice';

const ProductsPage: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const keyword = router.query.keyword as string | undefined;
  const pagenumber = router.query.pagenumber as string | undefined;

  const isAdmin = userInfo && userInfo.role === ADMIN_ROLE ? true : false;

  const {
    data: catalogData,
    isLoading: isLoadingCatalog,
    error: errorLoadingCatalog,
  } = useGetProductsQuery({
    keyword: keyword || '',
    pagenumber: pagenumber || '',
  });

  const loadingOrProcessing = isLoadingCatalog;

  return (
    <>
      <Meta title={H1_PRODUCTS} />
      <h1>{H1_PRODUCTS}</h1>
      {keyword && (
        <Link
          id='BUTTON_back'
          href={PRODUCTS_PAGE}
          className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {loadingOrProcessing ? (
        <Loader />
      ) : errorLoadingCatalog ? (
        <ErrorBlock error={errorLoadingCatalog} />
      ) : (
        <>
          <Row>
            {catalogData &&
              catalogData.products.length > 0 &&
              catalogData.products.map((product: IProduct) => (
                <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                  <ProductComponent product={product} />
                </Col>
              ))}
            {!catalogData ||
              (catalogData.products.length === 0 && (
                <p>No products match the search keyword</p>
              ))}
          </Row>
          {catalogData && (
            <Paginate
              pages={catalogData.pages}
              page={catalogData.page}
              keyword={keyword ? keyword : ''}
              isAdmin={isAdmin}
            />
          )}
        </>
      )}
    </>
  );
};

export default ProductsPage;
