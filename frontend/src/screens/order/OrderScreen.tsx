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
import { toast } from 'react-toastify';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import ErrorMessage from '../../components/general/ErrorMessage';
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

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    console.log('== orderScreen == useEffect ===');
    if (
      !errorLoadingPayPalClientId &&
      !loadingPayPalClientId &&
      payPalClientId &&
      payPalClientId.clientId
    ) {
      console.log('== loadPaypalScript.paypalDispatch - resetOptions ===');
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            clientId: payPalClientId.clientId,
            currency: CURRENCY_PAYPAL,
          },
        });
        console.log(
          '== loadPaypalScript.paypalDispatch - setLoadingStatus ==='
        );
        paypalDispatch({
          type: 'setLoadingStatus',
          value: SCRIPT_LOADING_STATE['PENDING'],
        });
      };
      if (order && !order.isPaid) {
        console.log('== !order.isPaid ===');
        if (!window.paypal) {
          console.log('== !window.paypal ===');
          loadPaypalScript();
        }
      }
    }
  }, [
    errorLoadingPayPalClientId,
    loadingPayPalClientId,
    order,
    payPalClientId,
    paypalDispatch,
  ]);

  function onApprove(actions: any) {
    console.log('== onApprove ===');
    try {
      return actions.order.capture().then(async function (details: any) {
        console.log('== payOrder ===');
        console.log('== orderId ===', orderId);
        console.log('== details ===', details);
        await payOrder({ orderId, details }).unwrap();
        refetch();
        if (errorPayingOrder) {
          setPayPalError(errorPayingOrder);
        } else {
          toast.success('Order is paid');
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

  function createOrder(data: any, actions: any) {
    if (!order || !order.totalPrice)
      throw new Error('THIS ERROR SHOULD NOT HAPPEN, TO IMPROVE HANDLING THIS');
    try {
      console.log('=== createOrder');
      return actions.order
        .create({
          purchase_units: [
            {
              amount: { value: order.totalPrice },
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
                  {order.createdAt && order.createdAt.substring(0, 10)}
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
                {order.isDelivered ? (
                  <Alert variant='success'>
                    Delivered on {order.deliveredAt}
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
                {order.isPaid ? (
                  <Alert variant='success'>Paid on {order.paidAt}</Alert>
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
                <OrderSummaryBlock
                  itemsPrice={order.itemsPrice}
                  shippingPrice={order.shippingPrice}
                  taxPrice={order.taxPrice}
                  totalPrice={order.totalPrice}
                />
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
