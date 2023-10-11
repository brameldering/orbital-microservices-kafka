import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { IProduct } from 'src/types/productTypes';

import ErrorMessage from '../components/general/ErrorMessage';
import Loader from '../components/general/Loader';
import Meta from '../components/general/Meta';
import Paginate from '../components/general/Paginate';
import Product from '../components/product/Product';
import { setConfig } from '../slices/configSlice';
import { ITestAPIState, testAPIAvailability } from '../slices/initThunk';
import { useGetVATandShippingFeeQuery } from '../slices/ordersApiSlice';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { pageNumber, keyword } = useParams();

  console.log('=== HomeScreen');

  const [initializing, setInitializing] = useState(false);
  const [initErrorMessage, setInitErrorMessage] = useState('');
  const testingInit = useSelector((state: ITestAPIState) => state.loading);
  const errorInit = useSelector((state: ITestAPIState) => state.error);
  useEffect(() => {
    dispatch(testAPIAvailability());
  }, [dispatch]);

  if (testingInit === 'pending') {
    setInitializing(true);
  }

  if (testingInit === 'failed') {
    setInitializing(false);
    setInitErrorMessage(errorInit || 'Unknown Error');
  }

  const {
    data: catalogData,
    isLoading: isLoadingCatalog,
    error: errorLoadingCatalog,
  } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  console.log('errorLoadingCatalog', errorLoadingCatalog);

  const {
    data: VATandShippingFee,
    isLoading: loadingVATandShippingFee,
    error: errorLoadingVATandShippingFee,
  } = useGetVATandShippingFeeQuery();

  console.log('errorLoadingCatalog', errorLoadingCatalog);
  console.log('errorLoadingVATandShippingFee', errorLoadingVATandShippingFee);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (VATandShippingFee) {
      console.log('=== HomeScreen = UseEffect VATandShippingFee');
      dispatch(setConfig(VATandShippingFee));
    }
  }, [VATandShippingFee]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <>
      {keyword && (
        <Link id='BUTTON_back' to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {initializing || isLoadingCatalog || loadingVATandShippingFee ? (
        <Loader />
      ) : initErrorMessage ? (
        <ErrorMessage error={initErrorMessage} />
      ) : errorLoadingCatalog ? (
        <ErrorMessage error={errorLoadingCatalog} />
      ) : errorLoadingVATandShippingFee ? (
        <ErrorMessage error={errorLoadingVATandShippingFee} />
      ) : (
        <>
          <Meta title='Products' />
          <h1>Products</h1>
          <Row>
            {catalogData &&
              catalogData.products.length > 0 &&
              catalogData.products.map((product: IProduct) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            {!catalogData ||
              (catalogData.products.length === 0 && (
                <p>No products match your search</p>
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

export default HomeScreen;
