import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import { Message, ErrorMessage } from '../../components/general/Messages';
import OrderItemLine from '../../components/order/OrderItemLine';
import OrderSummaryBlock from '../../components/order/OrderSummaryBlock';
import {
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from '../../slices/ordersApiSlice';
import { CURRENCY_PAYPAL } from '../../constantsFrontend';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const [payPalError, setPayPalError] = useState();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: order,
    refetch,
    isLoading,
    error: errorLoading,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: payingOrder, error: errorPayingOrder }] =
    usePayOrderMutation();

  const [
    deliverOrder,
    { isLoading: settingDeliverOrder, error: errorSettingDeliverOrder },
  ] = useDeliverOrderMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPalClientId,
    error: errorLoadingPayPalClientId,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (
      !errorLoadingPayPalClientId &&
      !loadingPayPalClientId &&
      paypal.clientId
    ) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: CURRENCY_PAYPAL,
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [
    errorLoadingPayPalClientId,
    loadingPayPalClientId,
    order,
    paypal,
    paypalDispatch,
  ]);

  function onApprove(data, actions) {
    try {
      return actions.order.capture().then(async function (details) {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        if (errorPayingOrder) {
          setPayPalError(errorPayingOrder);
        } else {
          toast.success('Order is paid');
        }
      });
    } catch (err) {
      setPayPalError(err);
    }
  }

  // TESTING ONLY! REMOVE BEFORE PRODUCTION
  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();
  //   if (errorPayingOrder) {
  //     setError(errorPayingOrder);
  //   } else {
  //     toast.success('Order is paid');
  //   }
  // }

  function onPayPalError(err) {
    setPayPalError(err);
  }

  function createOrder(data, actions) {
    try {
      return actions.order
        .create({
          purchase_units: [
            {
              amount: { value: order.totalPrice },
            },
          ],
        })
        .then((orderID) => {
          return orderID;
        });
    } catch (err) {
      setPayPalError(err);
    }
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
    } catch (err) {
      // Do nothing because the useDeliverOrderMutation will set errorSettingDeliverOrder
    }
  };

  return isLoading ? (
    <Loader />
  ) : errorLoading ? (
    <ErrorMessage error={errorLoading} />
  ) : (
    <>
      <Meta title='Order Details' />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Order Details</h2>
              <p>
                <strong>Order Id: </strong> {order.sequenceOrderId}
              </p>
              <p>
                <strong>Order Date: </strong> {order.createdAt.substring(0, 10)}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='info'>Not Delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='info'>Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message variant='info'>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <OrderItemLine productId={item.product} item={item} />
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
              <OrderSummaryBlock order={order} />
              {!order.isPaid && (
                <ListGroup.Item>
                  {payingOrder && <Loader />}
                  {isPending && <Loader />}
                  {errorPayingOrder ? (
                    <ErrorMessage error={errorPayingOrder} />
                  ) : errorSettingDeliverOrder ? (
                    <ErrorMessage error={errorSettingDeliverOrder} />
                  ) : payPalError ? (
                    <ErrorMessage error={payPalError} />
                  ) : (
                    <div>
                      {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                      {/* <Button
                        style={{ marginBottom: '10px' }}
                        onClick={onApproveTest}
                      >
                        Test Pay Order
                      </Button> */}
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onPayPalError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {settingDeliverOrder && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block mt-2'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
