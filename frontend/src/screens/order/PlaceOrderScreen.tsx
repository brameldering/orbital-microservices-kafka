import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Alert } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import ErrorMessage from '../../components/general/ErrorMessage';
import CheckoutSteps from '../../components/order/CheckoutSteps';
import OrderItemLine from '../../components/order/OrderItemLine';
import OrderSummaryBlock from '../../components/order/OrderSummaryBlock';
import { useCreateOrderMutation } from '../../slices/ordersApiSlice';
import { clearCartItems } from '../../slices/cartSlice';
import type { RootState } from '../../store';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);

  const [createOrder, { isLoading: creatingOrder, error: errorCreatingOrder }] =
    useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

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
        orderItems: orderItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        totalAmounts: cart.totalAmounts,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      // Do nothing because useCreateOrderMutation will set errorCreatingOrder in case of an error
    }
  };

  return (
    <>
      <Meta title='Confirm Order' />
      <CheckoutSteps currentStep={3} />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                {cart.shippingAddress.postalCode},{' '}
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
                      <OrderItemLine item={item} />
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
                  <ErrorMessage error={errorCreatingOrder} />
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
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
