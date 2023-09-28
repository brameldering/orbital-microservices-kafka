import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Meta from '../components/general/Meta';
import Loader from '../components/general/Loader';
import ErrorMessage from '../components/general/ErrorMessage';
import Paginate from '../components/general/Paginate';
import Product from '../components/product/Product';
import { setConfig } from '../slices/configSlice';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetVATandShippingFeeQuery } from '../slices/ordersApiSlice';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { pageNumber, keyword } = useParams();

  const {
    data: catalogData,
    isLoading: isLoadingCatalog,
    error: errorLoadingCatalog,
  } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  const {
    data: VATandShippingFee,
    isLoading: loadingVATandShippingFee,
    error: errorLoadingVATandShippingFee,
  } = useGetVATandShippingFeeQuery();

  useEffect(() => {
    if (VATandShippingFee) {
      dispatch(setConfig(VATandShippingFee));
    }
  }, [VATandShippingFee]);

  return (
    <>
      {keyword && (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {isLoadingCatalog || loadingVATandShippingFee ? (
        <Loader />
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
              catalogData.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            {!catalogData ||
              (catalogData.products.length === 0 && (
                <p>There are no products</p>
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
