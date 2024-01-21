import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextPageContext } from 'next';
import NextLink from 'next/link';
import MuiLink from '@mui/material/Link';
import Image from 'next/image';
import Router, { useRouter } from 'next/router';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import FormTitle from 'form/FormTitle';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import CheckoutSteps from 'components/CheckoutSteps';
import TITLES from 'constants/form-titles';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import PAGES from 'constants/client-pages';
import { ICartItem, IPriceCalcSettingsAttrs } from '@orbital_app/common';
import type { RootState } from 'slices/store';
import { addToCart, removeFromCart } from 'slices/cartSlice';
import { getPriceCalcSettings } from 'api/orders/get-price-calc-settings';

interface TPageProps {
  priceCalcSettings: IPriceCalcSettingsAttrs;
  error?: string[];
}

const CartScreen: React.FC<TPageProps> = ({ priceCalcSettings, error }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPath = router.pathname;

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const addToCartHandler = (product: ICartItem, qty: number) => {
    dispatch(addToCart({ cartItem: { ...product, qty }, priceCalcSettings }));
  };

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart({ id, priceCalcSettings }));
  };

  const nextPage = PAGES.SHIPPING_PAGE;
  const checkoutHandler = () => {
    if (userInfo?.name) {
      // user logged in, proceed to next page
      Router.push(nextPage);
    } else {
      // user not yet logged in, log in first then redirect to next page
      Router.push(`${PAGES.SIGNIN_PAGE}?redirect=${nextPage}`);
    }
  };

  return (
    <>
      <Meta title={TITLES.TITLE_SHOPPING_CART} />
      <FormTitle>{TITLES.TITLE_SHOPPING_CART}</FormTitle>
      <CheckoutSteps currentStep={0} />
      {error ? (
        <ErrorBlock error={error} />
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {cartItems.length === 0 ? (
                <Alert severity='info'>
                  Your cart is empty{' '}
                  <MuiLink
                    id='LINK_go_to_shop'
                    href={PAGES.PRODUCTS_PAGE}
                    component={NextLink}>
                    Go to shop
                  </MuiLink>
                </Alert>
              ) : (
                <Paper elevation={2} sx={{ p: 2 }}>
                  <List>
                    {cartItems.map((item) => (
                      <ListItem id='product_item' key={item.productId}>
                        <Grid container spacing={2}>
                          <Grid item xs={2}>
                            <Image
                              src={item.imageURL}
                              alt={item.productName}
                              width={50}
                              height={50}
                              layout='responsive'
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <MuiLink
                              id={`product_name_${item.productName}`}
                              href={`${PAGES.PRODUCT_DETAIL_PAGE}/${item.productId}?goBackPath=${currentPath}`}
                              component={NextLink}>
                              {item.productName}
                            </MuiLink>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography>
                              {CURRENCY_SYMBOL}
                              {item.price.toFixed(2)}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <FormControl fullWidth>
                              <Select
                                id={`select_quantity_${item.productName}`}
                                value={item.qty}
                                variant='outlined'
                                fullWidth
                                onChange={(e) =>
                                  addToCartHandler(item, Number(e.target.value))
                                }>
                                {[...Array(item.countInStock).keys()].map(
                                  (x) => (
                                    <MenuItem key={x + 1} value={x + 1}>
                                      {x + 1}
                                    </MenuItem>
                                  )
                                )}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={2}>
                            <IconButton
                              id={`remove_from_cart_${item.productName}`}
                              onClick={() =>
                                removeFromCartHandler(item.productId)
                              }>
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
            </Grid>
            <Grid item md={4} xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <List disablePadding>
                  <ListItem>
                    <Typography variant='h3'>
                      Subtotal (
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                      items
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography variant='h5'>
                      {CURRENCY_SYMBOL}
                      {cartItems
                        .reduce((acc, item) => acc + item.qty * item.price, 0)
                        .toFixed(2)}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Button
                      id='BUTTON_checkout'
                      variant='outlined'
                      color='primary'
                      fullWidth
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}>
                      Proceed To Checkout
                    </Button>
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </>
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

export default CartScreen;
