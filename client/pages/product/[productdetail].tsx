'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { toast } from 'react-toastify';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import Rating from 'components/Rating';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import { ICartItem } from '@orbitelco/common';
import { dateTimeToLocaleDateString } from 'utils/dateUtils';
import type { RootState } from 'slices/store';
import { addToCart } from 'slices/cartSlice';
import {
  useGetProductByIdQuery,
  useCreateReviewMutation,
} from 'slices/productsApiSlice';

const ProductDetailScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const router = useRouter();
  // Get current path to pass to login page for review
  const { asPath } = router;
  // The name productdetail should match the name of [productdetail].tsx
  const productdetail = router.query.productdetail as
    | string
    | string[]
    | undefined;
  let productId = Array.isArray(productdetail)
    ? productdetail[0]
    : productdetail;
  if (!productId) {
    productId = '';
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
    if (productId) {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
    }
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
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorBlock error={errorLoading} />
      ) : product ? (
        <>
          <Meta title={product.name} description={product.description} />
          <Row>
            <Col md={8}>
              <Image src={product.imageURL} alt={product.name} fluid />
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
            {/* <Col md={1}></Col> */}
            <Col md={4}>
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
            <Col md={8}>
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
                  {userInfo ? (
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
                      {errorCreatingReview && (
                        <ErrorBlock error={errorCreatingReview} />
                      )}
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
                      <Link
                        id='LINK_sign_in'
                        href={`/auth/signin?redirect=${asPath}`}>
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

export default ProductDetailScreen;
