import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NextPageContext } from 'next';
import Router from 'next/router';
// import { OnApproveActions } from '@paypal/paypal-js/types/components/buttons';
import { toast } from 'react-toastify';
import {
  PayPalButtons,
  usePayPalScriptReducer,
  SCRIPT_LOADING_STATE,
} from '@paypal/react-paypal-js';
import {
  dateTimeToLocaleDateString,
  dateTimeToLocaleTimeString,
} from 'utils/dateUtils';
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  Card,
  CardContent,
  Typography,
  Alert,
} from '@mui/material';
import FormTitle from 'form/FormTitle';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import OrderItemLine from 'components/OrderItemLine';
import OrderSummaryBlock from 'components/OrderSummaryBlock';
import TITLES from 'constants/form-titles';
import { CURRENCY_PAYPAL } from 'constants/constants-frontend';
import PAGES from 'constants/client-pages';
import { ADMIN_ROLE, IOrder } from '@orbital_app/common';
import { getOrderById } from 'api/orders/get-order-by-id';
import type { RootState } from 'slices/store';
import {
  useGetPaypalClientIdQuery,
  useSetPayDataMutation,
  useSetDeliverDataMutation,
} from 'slices/ordersApiSlice';

interface TPageProps {
  order: IOrder;
  error?: string[];
}

const OrderScreen: React.FC<TPageProps> = ({ order, error }) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [payPalError, setPayPalError] = useState<any>();
  const [deliverError, setDeliverError] = useState<any>();

  const {
    data: payPalClientId,
    isLoading: loadingPayPalClientId,
    error: errorLoadingPayPalClientId,
  } = useGetPaypalClientIdQuery();

  const [
    setPayData,
    { isLoading: settingPayData, error: errorSettingPayData },
  ] = useSetPayDataMutation();

  const [
    setDeliverData,
    { isLoading: settingDeliverData, error: errorSettingDeliverData },
  ] = useSetDeliverDataMutation();

  const [{ isPending, isRejected }, payPalDispatch] = usePayPalScriptReducer();

  const loadPayPalScript = async () => {
    console.log('== loadPayPalScript');
    if (payPalClientId?.clientId) {
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

  /* eslint-disable react-hooks/exhaustive-deps */
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
  /* eslint-enable react-hooks/exhaustive-deps */

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
              reference_id: order.sequentialOrderId,
              amount: { value: order.totalAmounts.totalPrice },
            },
          ],
        })
        .then((orderID: string) => {
          return orderID;
        });
    } catch (error: any) {
      console.error('Error in [orderdetail].tsx createOrder', error);
      setPayPalError(error);
    }
  }

  function onApprove(data: any, actions: any) {
    console.log('== onApprove ===');
    console.log(actions);
    // if (actions.order) {
    try {
      return actions.order.capture().then(async function (details: any) {
        console.log('== actions.order.capture ===');
        console.log('== Orbital orderId ===', order.id);
        console.log('== PayPal details ===', details);
        if (order.id) {
          await setPayData({ orderId: order.id, details }).unwrap();
        }
        Router.push(`${PAGES.ORDER_DETAIL_PAGE}/${order.id}`);
        if (errorSettingPayData) {
          setPayPalError(errorSettingPayData);
        } else {
          toast.success('Payment succesful');
        }
      });
    } catch (error: any) {
      console.error('Error in [orderdetail].tsx onApprove', error);
      setPayPalError(error);
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

  function onPayPalError(error: any) {
    console.error('Error in [orderdetail].tsx onPayPalError', error);
    setPayPalError(error);
  }

  const deliverHandler = async () => {
    try {
      if (!order.id) {
        throw new Error('Error: PayPal OrderId not defined');
      }
      await setDeliverData(order.id).unwrap();
      Router.push(`${PAGES.ORDER_DETAIL_PAGE}/${order.id}`);
    } catch (error: any) {
      console.error('Error in [orderdetail].tsx deliverHandler', error);
      setDeliverError(error);
    }
  };

  const disableButtons =
    loadingPayPalClientId || settingPayData || settingDeliverData || isPending;

  return (
    <>
      <Meta title={TITLES.TITLE_ORDER_DETAILS} />
      {error ? (
        <ErrorBlock error={error} />
      ) : (
        order && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <List disablePadding>
                <ListItem>
                  <FormTitle>{TITLES.TITLE_ORDER_DETAILS}</FormTitle>
                  <Typography paragraph>
                    <strong>Order Id: </strong> {order.sequentialOrderId}
                  </Typography>
                  <Typography paragraph>
                    <strong>Order Date: </strong>{' '}
                    {order.createdAt &&
                      dateTimeToLocaleDateString(order.createdAt)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <h3>Shipping</h3>
                  <Typography paragraph>
                    <strong>Name: </strong> {order.user?.name}
                  </Typography>
                  <Typography paragraph>
                    <strong>Email: </strong>{' '}
                    <a href={`mailto:${order.user && order.user.email}`}>
                      {order.user?.email}
                    </a>
                  </Typography>
                  <Typography paragraph>
                    <strong>Address: </strong>
                    {order.shippingAddress.address},{' '}
                    {order.shippingAddress.postalCode}{' '}
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.country}
                  </Typography>
                  {order.isDelivered && order.deliveredAt ? (
                    <Alert severity='success'>
                      Delivered on:{' '}
                      {dateTimeToLocaleDateString(order.deliveredAt)}
                    </Alert>
                  ) : (
                    <Alert severity='info'>Not Delivered</Alert>
                  )}
                </ListItem>
                <ListItem>
                  <Typography variant='h3'>Payment Method</Typography>
                  <Typography paragraph>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </Typography>
                  {order.isPaid && order.paidAt ? (
                    <Alert severity='success'>
                      Paid on: {dateTimeToLocaleDateString(order.paidAt)} at{' '}
                      {dateTimeToLocaleTimeString(order.paidAt)}
                      <br />
                      {`Payment Id: ${order.paymentResult?.id}`}
                    </Alert>
                  ) : (
                    <Alert severity='info'>Not Paid</Alert>
                  )}
                </ListItem>
                <ListItem>
                  <Typography variant='h3'>Order Items</Typography>
                  {order.orderItems.length === 0 ? (
                    <Alert severity='info'>Order is empty</Alert>
                  ) : (
                    order &&
                    order.orderItems.map((item, index) => (
                      <ListItem key={index}>
                        <OrderItemLine
                          item={item}
                          goBackPath={`${PAGES.ORDER_DETAIL_PAGE}/${order.id}`}
                        />
                      </ListItem>
                    ))
                  )}
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <OrderSummaryBlock totalAmounts={order.totalAmounts} />
                  {disableButtons && (
                    <>
                      <br />
                      <Loader />
                    </>
                  )}
                  {!order.isPaid && (
                    <>
                      {errorSettingPayData ? (
                        <ErrorBlock error={errorSettingPayData} />
                      ) : errorSettingDeliverData ? (
                        <ErrorBlock error={errorSettingDeliverData} />
                      ) : payPalError ? (
                        <ErrorBlock error={payPalError} />
                      ) : (
                        <Box>
                          {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                          {/* <Button
                        style={{ marginBottom: '10px' }}
                        onClick={onApproveTest}
                      >
                        Test Pay Order
                      </Button> */}
                          <Box>
                            <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onPayPalError}></PayPalButtons>
                          </Box>
                        </Box>
                      )}
                    </>
                  )}
                  {deliverError ? (
                    <ErrorBlock error={deliverError} />
                  ) : (
                    userInfo?.role === ADMIN_ROLE &&
                    order &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <ListItem>
                        <Button
                          variant='contained'
                          color='primary'
                          fullWidth
                          onClick={deliverHandler}>
                          Mark As Delivered
                        </Button>
                      </ListItem>
                    )
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )
      )}
    </>
  );
};

// Fetch order
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    // the name of the query parameter ('orderdetail') should match the [filename].tsx
    const id = context.query.orderdetail as string | string[] | undefined;
    let orderId = Array.isArray(id) ? id[0] : id;
    if (!orderId) {
      orderId = '';
    }
    let order = null;
    if (orderId) {
      order = await getOrderById(context, orderId);
    }
    return {
      props: { order },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { order: {}, error: parsedError },
    };
  }
};

export default OrderScreen;
