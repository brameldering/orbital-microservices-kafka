'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { NextPageContext } from 'next';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Alert,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  TextareaAutosize,
  Box,
} from '@mui/material';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import CustomRating from 'components/Rating';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import { ICartItem, IPriceCalcSettingsAttrs } from '@orbitelco/common';
import { dateTimeToLocaleDateString } from 'utils/dateUtils';
import { PRODUCTS_PAGE, CART_PAGE, SIGNIN_PAGE } from 'constants/client-pages';
import type { RootState } from 'slices/store';
import { addToCart } from 'slices/cartSlice';
import {
  useGetProductByIdQuery,
  useCreateReviewMutation,
} from 'slices/productsApiSlice';
import { getPriceCalcSettings } from 'api/orders/get-price-calc-settings';

interface TPageProps {
  priceCalcSettings: IPriceCalcSettingsAttrs;
  error?: string[];
}

const ProductDetailScreen: React.FC<TPageProps> = ({
  priceCalcSettings,
  error,
}) => {
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

  const goBackPath = router.query.goBackPath || PRODUCTS_PAGE;

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
      dispatch(
        addToCart({ cartItem: { ...cartItem, qty }, priceCalcSettings })
      );
      Router.push(CART_PAGE);
    }
  };

  const [
    createReview,
    { isLoading: creatingProductReview, error: errorCreatingReview },
  ] = useCreateReviewMutation();
  const submitReviewHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
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
    } catch (err) {
      // Do nothing, this is to avoid uncaught exception
    }
  };
  const loadingOrProcessing = isLoading || creatingProductReview;

  return (
    <>
      <Box sx={{ my: 4 }}>
        <Link id='BUTTON_go_back' href={goBackPath.toString()} passHref>
          <Button variant='outlined'>Go Back</Button>
        </Link>
      </Box>
      {error ? (
        <ErrorBlock error={error} />
      ) : errorLoading ? (
        <ErrorBlock error={errorLoading} />
      ) : product ? (
        <>
          <Meta title={product.name} description={product.description} />
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <Card>
                <CardContent>
                  <Image
                    src={product.imageURL}
                    alt={product.name}
                    layout='responsive'
                    width={500} // Set the desired width
                    height={300} // Set the height according to the aspect ratio of your image
                  />
                  <Typography variant='h3'>{product.name}</Typography>
                  <CustomRating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                  <Typography variant='body1'>
                    Price: {CURRENCY_SYMBOL}
                    {product.price.toFixed(2)}
                  </Typography>
                  <Typography variant='body1'>
                    Description: {product.description}
                  </Typography>
                  <Typography variant='body1'>
                    Product Id: {product.sequentialProductId}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* <Col md={1}></Col> */}
            <Grid item md={4} xs={12}>
              <Card>
                <CardContent>
                  <Typography variant='subtitle1'>Price:</Typography>
                  <Typography variant='body1' gutterBottom>
                    <strong>
                      {CURRENCY_SYMBOL}
                      {product.price.toFixed(2)}
                    </strong>
                  </Typography>
                  <Typography variant='subtitle1'>Status:</Typography>
                  <Typography variant='body1' gutterBottom>
                    {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                  </Typography>
                  {product.countInStock > 0 && (
                    <FormControl fullWidth margin='normal'>
                      <InputLabel>Qty</InputLabel>
                      <Select
                        id='select_quantity'
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}>
                        {/* The following creates an array starting with 0 to countinStock-1:
                                [...Array(product.countInStock).keys()] */}
                        {[...Array(product.countInStock).keys()].map((x) => (
                          <MenuItem key={x + 1} value={x + 1}>
                            {x + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  <Box mt={2}>
                    <Button
                      id='BUTTON_add_to_cart'
                      variant='contained'
                      fullWidth
                      disabled={
                        product.countInStock === 0 || loadingOrProcessing
                      }
                      onClick={addToCartHandler}>
                      Add To Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container className='review' spacing={2}>
            <Grid item md={8}>
              <Card>
                <CardContent>
                  <Typography variant='h3'>Reviews</Typography>
                  {product.reviews.length === 0 && (
                    <Alert severity='info'>No Reviews</Alert>
                  )}
                  {product.reviews.map((review) => (
                    <Box key={review.id} sx={{ my: 2 }}>
                      <Typography variant='subtitle1'>
                        {review.userName}
                      </Typography>
                      <CustomRating value={review.rating} />
                      <Typography variant='body2'>
                        {dateTimeToLocaleDateString(review.createdAt)}
                      </Typography>
                      <Typography variant='body2'>{review.comment}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant='h3'>
                      Write a Customer Review
                    </Typography>
                    {creatingProductReview && <Loader />}
                    {userInfo ? (
                      <Box component='form' onSubmit={submitReviewHandler}>
                        <FormControl fullWidth margin='normal'>
                          <InputLabel>Rating</InputLabel>
                          <Select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            required>
                            <MenuItem value=''>Select...</MenuItem>
                            <MenuItem value='1'>1 - Poor</MenuItem>
                            <MenuItem value='2'>2 - Fair</MenuItem>
                            <MenuItem value='3'>3 - Good</MenuItem>
                            <MenuItem value='4'>4 - Very Good</MenuItem>
                            <MenuItem value='5'>5 - Excellent</MenuItem>
                          </Select>
                        </FormControl>
                        <FormControl fullWidth margin='normal'>
                          <TextareaAutosize
                            minRows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            placeholder='Comment'
                          />
                        </FormControl>
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
                          variant='contained'
                          color='primary'
                          sx={{ mt: 2 }}>
                          Submit
                        </Button>
                      </Box>
                    ) : (
                      <Alert severity='info'>
                        Please{' '}
                        <Link
                          id='LINK_sign_in'
                          href={`${SIGNIN_PAGE}?redirect=${asPath}`}
                          passHref>
                          <Typography variant='subtitle1' component='a'>
                            sign in
                          </Typography>
                        </Link>{' '}
                        to write a review
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            {isLoading && <Loader />}
          </Grid>
        </>
      ) : (
        <p>This should never be shown</p>
      )}
    </>
  );
};

// Fetch price calc settings
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    // Call the corresponding API function to fetch price settings
    const priceCalcSettings = await getPriceCalcSettings(context);
    return {
      props: { priceCalcSettings },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { priceCalcSettings: {}, error: parsedError },
    };
  }
};

export default ProductDetailScreen;
