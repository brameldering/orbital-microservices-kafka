import React from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Meta from '../components/general/Meta';
import Loader from '../components/general/Loader';
import { ErrorMessage } from '../components/general/Messages';
import Paginate from '../components/general/Paginate';
import Product from '../components/product/Product';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const {
    data,
    isLoading,
    error: errorLoading,
  } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {keyword && (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorMessage error={errorLoading} />
      ) : (
        <>
          <Meta title='Products' />
          <h1>Products</h1>
          <Row>
            {data &&
              data.products.length > 0 &&
              data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            {!data ||
              (data.products.length === 0 && <p>There are no products</p>)}
          </Row>
          {data && (
            <Paginate
              pages={data.pages}
              page={data.page}
              keyword={keyword ? keyword : ''}
            />
          )}
        </>
      )}
    </>
  );
};

export default HomeScreen;
