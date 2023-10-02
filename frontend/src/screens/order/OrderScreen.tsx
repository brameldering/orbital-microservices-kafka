import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Button, Alert } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import {
  PayPalButtons,
  usePayPalScriptReducer,
  SCRIPT_LOADING_STATE,
} from '@paypal/react-paypal-js';
// import { OnApproveActions } from '@paypal/paypal-js/types/components/buttons';
import { toast } from 'react-toastify';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import ErrorMessage from '../../components/general/ErrorMessage';
import {
  dateTimeToLocaleDateString,
  dateTimeToLocaleTimeString,
} from '../../utils/dateUtils';
import OrderItemLine from '../../components/order/OrderItemLine';
import OrderSummaryBlock from '../../components/order/OrderSummaryBlock';
import {
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from '../../slices/ordersApiSlice';
import { CURRENCY_PAYPAL } from '../../constantsFrontend';
import type { RootState } from '../../store';

const OrderScreen = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [payPalError, setPayPalError] = useState<any>();
  const [deliverError, setDeliverError] = useState<any>();

  const { id } = useParams();
  let orderId: string = '';
  if (id && id.length > 0) {
    orderId = id;
  }

  const {
    data: order,
    refetch,
    isLoading,
    error: errorLoading,
  } = useGetOrderDetailsQuery(orderId);

  const {
    data: payPalClientId,
    isLoading: loadingPayPalClientId,
    error: errorLoadingPayPalClientId,
  } = useGetPaypalClientIdQuery();

  const [payOrder, { isLoading: payingOrder, error: errorPayingOrder }] =
    usePayOrderMutation();

  const [
    deliverOrder,
    { isLoading: settingDeliverOrder, error: errorSettingDeliverOrder },
  ] = useDeliverOrderMutation();

  const [{ isPending, isRejected }, payPalDispatch] = usePayPalScriptReducer();

  const loadPayPalScript = async () => {
    console.log('== loadPayPalScript');
    if (payPalClientId && payPalClientId.clientId) {
      console.log('=======> payPalDispatch resetOptions');
      payPalDispatch({
        type: 'resetOptions',
        value: {
          clientId: payPalClientId.clientId,
          currency: CURRENCY_PAYPAL,
        },
      });
      console.log('=======> payPalDispatch setLoadingStatus');
      payPalDispatch({
        type: 'setLoadingStatus',
        value: SCRIPT_LOADING_STATE['PENDING'],
      });
    } else {
      throw new Error('Error: PayPal ClientId not defined');
    }
  };

  // Perform loadPayPalScript when order info has been loaded
  useEffect(() => {
    console.log('== orderScreen == useEffect ===');
    if (!errorLoadingPayPalClientId && !loadingPayPalClientId) {
      // if !order.isPaid and paypal window not yet shown then load script
      if (order && !order.isPaid) {
        console.log('== !order.isPaid ===');
        if (!window.paypal) {
          console.log('== !window.paypal ===');
          try {
            loadPayPalScript();
          } catch (err) {
            console.log('isRejected', isRejected);
            setPayPalError(err);
          }
        }
      }
    }
  }, [errorLoadingPayPalClientId, loadingPayPalClientId, order]);

  function createOrder(data: any, actions: any) {
    if (!order || !order.totalAmounts.totalPrice)
      throw new Error('Error: order does not exist');
    try {
      console.log('=== createOrder');
      return actions.order
        .create({
          purchase_units: [
            {
              description: 'Orbital order',
              reference_id: order.sequenceOrderId,
              amount: { value: order.totalAmounts.totalPrice },
            },
          ],
        })
        .then((orderID: string) => {
          return orderID;
        });
    } catch (err) {
      console.log('=== createOrder Error');
      console.log(err);
      setPayPalError(err);
    }
  }

  function onApprove(data: any, actions: any) {
    console.log('== onApprove ===');
    console.log(actions);
    // if (actions.order) {
    try {
      return actions.order.capture().then(async function (details: any) {
        console.log('== actions.order.capture ===');
        console.log('== Orbital orderId ===', orderId);
        console.log('== PayPal details ===', details);
        await payOrder({ orderId, details }).unwrap();
        refetch();
        if (errorPayingOrder) {
          setPayPalError(errorPayingOrder);
        } else {
          toast.success('Payment succesful');
        }
      });
    } catch (err: any) {
      console.log('=== onApprove error');
      console.log(err);
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

  function onPayPalError(err: any) {
    console.log('=== onPayPalError');
    console.log(err);
    setPayPalError(err);
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId).unwrap();
      refetch();
    } catch (err) {
      setDeliverError(err);
    }
  };

  console.log('Before Render: Order');
  console.log(order);

  return isLoading ? (
    <Loader />
  ) : errorLoading ? (
    <ErrorMessage error={errorLoading} />
  ) : (
    <>
      <Meta title='Order Details' />
      {order && (
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Details</h2>
                <p>
                  <strong>Order Id: </strong> {order.sequenceOrderId}
                </p>
                <p>
                  <strong>Order Date: </strong>{' '}
                  {order.createdAt &&
                    dateTimeToLocaleDateString(order.createdAt)}
                </p>
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> {order.user && order.user.name}
                </p>
                <p>
                  <strong>Email: </strong>{' '}
                  <a href={`mailto:${order.user && order.user.email}`}>
                    {order.user && order.user.email}
                  </a>
                </p>
                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                  {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered && order.deliveredAt ? (
                  <Alert variant='success'>
                    Delivered on:{' '}
                    {dateTimeToLocaleDateString(order.deliveredAt)}
                  </Alert>
                ) : (
                  <Alert variant='info'>Not Delivered</Alert>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>
                {order.isPaid && order.paidAt ? (
                  <Alert variant='success'>
                    Paid on: {dateTimeToLocaleDateString(order.paidAt)} at{' '}
                    {dateTimeToLocaleTimeString(order.paidAt)}
                    <br />
                    {order.paymentResult &&
                      `Payment Id: ${order.paymentResult.id}`}
                  </Alert>
                ) : (
                  <Alert variant='info'>Not Paid</Alert>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <h2>Order Items</h2>
                {order.orderItems.length === 0 ? (
                  <Alert variant='info'>Order is empty</Alert>
                ) : (
                  <ListGroup variant='flush'>
                    {order &&
                      order.orderItems.map((item, index) => (
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
                <OrderSummaryBlock totalAmounts={order.totalAmounts} />
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
                            onError={onPayPalError}></PayPalButtons>
                        </div>
                      </div>
                    )}
                  </ListGroup.Item>
                )}
                {settingDeliverOrder && <Loader />}
                {deliverError && <ErrorMessage error={deliverError} />}
                {userInfo &&
                  userInfo.isAdmin &&
                  order &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <ListGroup.Item>
                      <Button
                        type='button'
                        className='btn btn-block mt-2'
                        onClick={deliverHandler}>
                        Mark As Delivered
                      </Button>
                    </ListGroup.Item>
                  )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default OrderScreen;
