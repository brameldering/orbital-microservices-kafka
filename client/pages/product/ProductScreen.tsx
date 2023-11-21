import React, { useState } from 'react';
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Form,
  Alert,
} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { NextPageContext } from 'next';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import Meta from '../../components/Meta';
import Loader from '../../components/Loader';
import ErrorBlock from '../../components/ErrorBlock';
import Rating from '../../components/Rating';
import { CURRENCY_SYMBOL } from '../../constants/constants-frontend';
import { addToCart } from '../../slices/cartSlice';
import {
  useGetProductByIdQuery,
  useCreateReviewMutation,
} from '../../slices/productsApiSlice';
import { ICartItem } from '../../types/cart-types';
import { ICurrentUser } from 'types/user-types';
import { dateTimeToLocaleDateString } from '../../utils/dateUtils';
import { getCurrentUser } from 'api/get-current-user';
// import useRequest from 'hooks/use-request';
// import { BASE_URL } from 'constants/constants-frontend';
// import { UPDATE_PASSWORD_URL } from '@orbitelco/common';

interface TPageProps {
  currentUser?: ICurrentUser;
}

const ProductScreen: React.FC<TPageProps> = ({ currentUser }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const id = router.query.id as string | undefined;

  let productId: string = '';
  if (id && id.length > 0) {
    productId = id;
  }

  const goBackPath = router.query.goBackPath || '/';

  const [qty, setQty] = useState<number>(1);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');

  const {
    data: product,
    isLoading,
    refetch,
    error: errorLoading,
  } = useGetProductByIdQuery(productId);

  const addToCartHandler = () => {
    if (product) {
      const cartItem: ICartItem = {
        productId: product.id,
        productName: product.name,
        imageURL: product.imageURL,
        price: product.price,
        countInStock: product.countInStock,
        qty: 0,
      };
      dispatch(addToCart({ ...cartItem, qty }));
      Router.push('/order/cart');
    }
  };

  const [
    createReview,
    { isLoading: creatingProductReview, error: errorCreatingReview },
  ] = useCreateReviewMutation();

  const submitReviewHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createReview({
      productId,
      rating,
      comment,
    }).unwrap();
    if (!errorCreatingReview) {
      refetch();
      setRating(0);
      setComment('');
      toast.success('Review created');
    }
  };

  const loadingOrProcessing = isLoading || creatingProductReview;

  return (
    <>
      <Link
        id='BUTTON_go_back'
        className='btn btn-light my-3'
        href={goBackPath.toString()}>
        Go Back
      </Link>
      {errorCreatingReview && <ErrorBlock error={errorCreatingReview} />}
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorBlock error={errorLoading} />
      ) : product ? (
        <>
          <Meta title={product.name} description={product.description} />
          <Row>
            <Col md={6}>
              <Image src={product.imageURL} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  Price: {CURRENCY_SYMBOL}
                  {product.price.toFixed(2)}
                </ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
                <ListGroup.Item>
                  Product Id: {product.sequenceProductId}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>
                          {CURRENCY_SYMBOL}
                          {product.price.toFixed(2)}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            id='select_quantity'
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}>
                            {/* The following creates an array starting with 0 to countinStock-1:
                                [...Array(product.countInStock).keys()] */}
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      id='BUTTON_add_to_cart'
                      className='btn-block mt-2'
                      type='button'
                      disabled={
                        product.countInStock === 0 || loadingOrProcessing
                      }
                      onClick={addToCartHandler}>
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className='review'>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && (
                <Alert variant='info'>No Reviews</Alert>
              )}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review.id}>
                    <strong>{review.userName}</strong>
                    <Rating value={review.rating} />
                    <p>{dateTimeToLocaleDateString(review.createdAt)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>
                  {creatingProductReview && <Loader />}
                  {currentUser?.name ? (
                    <Form onSubmit={submitReviewHandler}>
                      <Form.Group className='my-2' controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          required
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}>
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className='my-2' controlId='comment'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          style={{ lineHeight: '1.5' }}
                          required
                          value={comment}
                          onChange={(e) =>
                            setComment(e.target.value)
                          }></Form.Control>
                      </Form.Group>
                      <Button
                        id='BUTTON_review_submit'
                        disabled={
                          loadingOrProcessing ||
                          comment.trim().length === 0 ||
                          rating === 0
                        }
                        type='submit'
                        variant='primary mt-2'>
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Alert variant='info'>
                      Please{' '}
                      <Link id='LINK_sign_in' href='/auth/signin'>
                        sign in
                      </Link>{' '}
                      to write a review
                    </Alert>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      ) : (
        <p>This should never be shown</p>
      )}
    </>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { data } = await getCurrentUser(context);
  return { props: data };
};

export default ProductScreen;
