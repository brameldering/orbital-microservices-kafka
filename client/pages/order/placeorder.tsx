import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import {
  Grid,
  Card,
  CardContent,
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
import { TITLE_CONFIRM_ORDER } from 'constants/form-titles';
import {
  SHIPPING_PAGE,
  PAYMENT_INFO_PAGE,
  PLACE_ORDER_PAGE,
  ORDER_DETAIL_PAGE,
} from 'constants/client-pages';
import { clearCartItems } from 'slices/cartSlice';
import { useCreateOrderMutation } from 'slices/ordersApiSlice';
import type { RootState } from 'slices/store';

const PlaceOrderScreen = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      Router.push(SHIPPING_PAGE);
    } else if (!cart.paymentMethod) {
      Router.push(PAYMENT_INFO_PAGE);
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
      Router.push(`${ORDER_DETAIL_PAGE}/${res.id}`);
    } catch (err) {
      // Do nothing because useCreateOrderMutation will set errorCreatingOrder in case of an error
    }
  };

  return (
    <>
      <Meta title={TITLE_CONFIRM_ORDER} />
      <CheckoutSteps currentStep={3} />
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <List>
            <ListItem>
              <Typography variant='h3'>Shipping</Typography>
              <Typography paragraph>
                <strong>Address: </strong>
                {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.postalCode} {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.country}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant='h3'>Payment Method</Typography>
              <Typography paragraph>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </Typography>
            </ListItem>
            <ListItem>
              <Typography variant='h3'>Order Items</Typography>
              {cart.cartItems.length === 0 ? (
                <Alert severity='info'>Your cart is empty</Alert>
              ) : (
                <List>
                  {cart.cartItems.map((item, index) => (
                    <ListItem key={index}>
                      <OrderItemLine
                        item={item}
                        goBackPath={PLACE_ORDER_PAGE}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </ListItem>
          </List>
        </Grid>
        <Grid item md={4} xs={12}>
          <Card>
            <CardContent>
              <OrderSummaryBlock totalAmounts={cart.totalAmounts} />
              {errorCreatingOrder && <ErrorBlock error={errorCreatingOrder} />}
              <Button
                id='BUTTON_place_order'
                type='button'
                className='btn-block mt-2'
                disabled={cart.cartItems.length === 0 || creatingOrder}
                onClick={placeOrderHandler}>
                Place Order
              </Button>
              {creatingOrder && <Loader />}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PlaceOrderScreen;
