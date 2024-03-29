'use client';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { NextPageContext } from 'next';
import NextLink from 'next/link';
import MuiLink from '@mui/material/Link';
import Router, { useRouter } from 'next/router';
import Image from 'next/image';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Typography from '@mui/material/Typography';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import CustomRating from 'components/Rating';
import FormButtonBox from 'form/FormButtonBox';
import { SubmitButton } from 'form/FormButtons';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import { ICartItem, IPriceCalcSettingsAttrs } from '@orbital_app/common';
import { dateTimeToLocaleDateString } from 'utils/dateUtils';
import { parseError } from 'utils/parse-error';
import PAGES from 'constants/client-pages';
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

  const goBackPath = router.query.goBackPath || PAGES.PRODUCTS_PAGE;

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
      Router.push(PAGES.CART_PAGE);
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
        <NextLink id='BUTTON_go_back' href={goBackPath.toString()} passHref>
          <Button variant='outlined'>Go Back</Button>
        </NextLink>
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
                  <Typography variant='h5'>
                    Price: {CURRENCY_SYMBOL}
                    {product.price.toFixed(2)}
                  </Typography>
                  <Typography>Description: {product.description}</Typography>
                  <Typography variant='h5'>
                    Product Id: {product.sequentialProductId}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* <Col md={1}></Col> */}
            <Grid item md={4} xs={12}>
              <Card>
                <CardContent>
                  <Typography variant='h5'>
                    Price:
                    <strong>
                      {CURRENCY_SYMBOL}
                      {product.price.toFixed(2)}
                    </strong>
                  </Typography>
                  <Typography variant='h5'>
                    Status:
                    <strong>
                      {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                    </strong>
                  </Typography>
                  {product.countInStock > 0 && (
                    <FormControl fullWidth margin='normal'>
                      <InputLabel>Qty</InputLabel>
                      <Select
                        id='select_quantity'
                        value={qty}
                        variant='standard'
                        fullWidth
                        onChange={(e) => setQty(Number(e.target.value))}>
                        {/* The following creates an array starting with 0 to countinStock-1 */}
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
                      variant='outlined'
                      color='primary'
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
                  <Typography variant='h3' sx={{ mb: 2 }}>
                    Reviews
                  </Typography>
                  {product.reviews.length === 0 && (
                    <Alert severity='info'>No Reviews</Alert>
                  )}
                  {product.reviews.map((review) => (
                    <Box key={review.id} sx={{ my: 2 }}>
                      <Typography variant='body1'>{review.userName}</Typography>
                      <CustomRating value={review.rating} />
                      <Typography variant='body2'>
                        {dateTimeToLocaleDateString(review.createdAt)}
                      </Typography>
                      <Typography variant='body2'>{review.comment}</Typography>
                    </Box>
                  ))}
                  <Box sx={{ mt: 3, mb: 2 }}>
                    <Typography variant='h3' sx={{ mb: 2 }}>
                      Write a Customer Review
                    </Typography>
                    {creatingProductReview && <Loader />}
                    {userInfo ? (
                      <Box component='form' onSubmit={submitReviewHandler}>
                        <FormControl fullWidth margin='normal'>
                          <InputLabel>Rating</InputLabel>
                          <Select
                            value={rating}
                            variant='standard'
                            fullWidth
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
                          <InputLabel>Comment</InputLabel>
                          <TextareaAutosize
                            minRows={6}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                          />
                        </FormControl>
                        {errorCreatingReview && (
                          <ErrorBlock error={errorCreatingReview} />
                        )}
                        <FormButtonBox>
                          <SubmitButton
                            id='BUTTON_review_submit'
                            disabled={
                              loadingOrProcessing ||
                              comment.trim().length === 0 ||
                              rating === 0
                            }
                            label='Save'
                          />
                        </FormButtonBox>
                      </Box>
                    ) : (
                      <Alert severity='info'>
                        Please{' '}
                        <MuiLink
                          id='LINK_sign_in'
                          href={`${PAGES.SIGNIN_PAGE}?redirect=${asPath}`}
                          component={NextLink}>
                          sign in{' '}
                        </MuiLink>
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
