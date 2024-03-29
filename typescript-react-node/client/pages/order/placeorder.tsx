import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ErrorBlock from 'components/ErrorBlock';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import CheckoutSteps from 'components/CheckoutSteps';
import OrderItemLine from 'components/OrderItemLine';
import OrderSummaryBlock from 'components/OrderSummaryBlock';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
import FormButtonBox from 'form/FormButtonBox';
import { BackButton } from 'form/FormButtons';
import { clearCartItems } from 'slices/cartSlice';
import { useCreateOrderMutation } from 'slices/ordersApiSlice';
import type { RootState } from 'slices/store';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      Router.push(PAGES.SHIPPING_PAGE);
    } else if (!cart.paymentMethod) {
      Router.push(PAGES.PAYMENT_INFO_PAGE);
    }
  }, [cart.paymentMethod, cart.shippingAddress.address]);

  const [createOrder, { isLoading: creatingOrder, error: errorCreatingOrder }] =
    useCreateOrderMutation();

  const placeOrderHandler = async () => {
    const orderItems = cart.cartItems.map((item) => {
      return {
        productId: item.productId,
        productName: item.productName,
        imageURL: item.imageURL,
        price: item.price,
        qty: item.qty,
      };
    });
    try {
      const res = await createOrder({
        orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        totalAmounts: cart.totalAmounts,
      }).unwrap();
      dispatch(clearCartItems());
      Router.push(`${PAGES.ORDER_DETAIL_PAGE}/${res.id}`);
    } catch (err) {
      // Do nothing because useCreateOrderMutation will set errorCreatingOrder in case of an error
    }
  };

  const goBack = async () => {
    Router.push(PAGES.PAYMENT_INFO_PAGE);
  };

  return (
    <>
      <Meta title={TITLES.TITLE_CONFIRM_ORDER} />
      <CheckoutSteps currentStep={3} />
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant='h3' sx={{ mt: 2, mb: 1 }}>
                  Shipping
                </Typography>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <strong>Address: </strong>
                  {cart.shippingAddress.address},{' '}
                  {cart.shippingAddress.postalCode} {cart.shippingAddress.city},{' '}
                  {cart.shippingAddress.country}
                </Paper>
              </CardContent>
              <CardContent>
                <Typography variant='h3' sx={{ mt: 2, mb: 1 }}>
                  Payment Method
                </Typography>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <strong>Method: </strong>
                  {cart.paymentMethod}
                </Paper>
              </CardContent>
              <CardContent>
                <Typography variant='h3' sx={{ mt: 2, mb: 1 }}>
                  Order Items
                </Typography>
                <Paper elevation={2} sx={{ p: 2 }}>
                  {cart.cartItems.length === 0 ? (
                    <Alert severity='info'>Your cart is empty</Alert>
                  ) : (
                    <List>
                      {cart.cartItems.map((item, index) => (
                        <ListItem key={index}>
                          <OrderItemLine
                            item={item}
                            goBackPath={PAGES.PLACE_ORDER_PAGE}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Card>
            <CardContent>
              <Typography variant='h3' sx={{ my: 2 }}>
                Order Summary
              </Typography>
              <OrderSummaryBlock totalAmounts={cart.totalAmounts} />
              {errorCreatingOrder && <ErrorBlock error={errorCreatingOrder} />}
              <FormButtonBox>
                <BackButton onClick={goBack} />
                <Button
                  id='BUTTON_place_order'
                  type='button'
                  variant='outlined'
                  color='primary'
                  disabled={cart.cartItems.length === 0 || creatingOrder}
                  onClick={placeOrderHandler}>
                  Place Order
                </Button>
              </FormButtonBox>
              {creatingOrder && <Loader />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PlaceOrderScreen;
