import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import Paginate from 'components/Paginate';
import ProductComponent from '../components/ProductComponent';
import { IProduct } from '@orbitelco/common';
import { useGetProductsQuery } from 'slices/productsApiSlice';

const LandingPage: React.FC = () => {
  const router = useRouter();
  const pageNumber = router.query.pageNumber as string | undefined;
  const keyword = router.query.keyword as string | undefined;

  const {
    data: catalogData,
    isLoading: isLoadingCatalog,
    error: errorLoadingCatalog,
  } = useGetProductsQuery({
    keyword: keyword || '',
    pageNumber: pageNumber || '',
  });

  const loadingOrProcessing = isLoadingCatalog;

  return (
    <>
      <Meta title='Products' />
      <h1>Products</h1>
      {keyword && (
        <Link id='BUTTON_back' href='/' className='btn btn-light mb-4'>
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
            />
          )}
        </>
      )}
    </>
  );
};

export default LandingPage;
