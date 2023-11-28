import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Alert } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import ErrorBlock from 'components/ErrorBlock';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import CheckoutSteps from 'components/CheckoutSteps';
import OrderItemLine from 'components/OrderItemLine';
import OrderSummaryBlock from 'components/OrderSummaryBlock';
import { H1_CONFIRM_ORDER } from 'constants/form-titles';
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
      <Meta title={H1_CONFIRM_ORDER} />
      <CheckoutSteps currentStep={3} />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.postalCode} {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Alert variant='info'>Your cart is empty</Alert>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <OrderItemLine
                        item={item}
                        goBackPath={PLACE_ORDER_PAGE}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <OrderSummaryBlock totalAmounts={cart.totalAmounts} />
              <ListGroup.Item>
                {errorCreatingOrder && (
                  <ErrorBlock error={errorCreatingOrder} />
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  id='BUTTON_place_order'
                  type='button'
                  className='btn-block mt-2'
                  disabled={cart.cartItems.length === 0 || creatingOrder}
                  onClick={placeOrderHandler}>
                  Place Order
                </Button>
                {creatingOrder && <Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
