import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import {
  Stack,
  Grid,
  Card,
  CardContent,
  Paper,
  Button,
  List,
  ListItem,
  Typography,
  Alert,
} from '@mui/material';
import ErrorBlock from 'components/ErrorBlock';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import CheckoutSteps from 'components/CheckoutSteps';
import OrderItemLine from 'components/OrderItemLine';
import OrderSummaryBlock from 'components/OrderSummaryBlock';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
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
                {cart.cartItems.length === 0 ? (
                  <Alert severity='info'>Your cart is empty</Alert>
                ) : (
                  <Paper elevation={2} sx={{ p: 2 }}>
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
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Card>
            <CardContent>
              <OrderSummaryBlock totalAmounts={cart.totalAmounts} />
              <List>
                <ListItem>
                  {errorCreatingOrder && (
                    <ErrorBlock error={errorCreatingOrder} />
                  )}
                  <Button
                    id='BUTTON_place_order'
                    type='button'
                    variant='outlined'
                    color='primary'
                    disabled={cart.cartItems.length === 0 || creatingOrder}
                    onClick={placeOrderHandler}>
                    Place Order
                  </Button>
                  {creatingOrder && <Loader />}
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PlaceOrderScreen;
