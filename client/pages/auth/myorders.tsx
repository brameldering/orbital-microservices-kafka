import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
// import { useSelector } from 'react-redux';
import Link from 'next/link';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import { ORDER_DETAIL_PAGE } from 'constants/client-pages';
import { dateTimeToLocaleDateString } from '../../utils/dateUtils';
// import type { RootState } from 'slices/store';
import { useGetMyOrdersQuery } from 'slices/ordersApiSlice';

const MyOrdersScreen = () => {
  // const { userInfo } = useSelector((state: RootState) => state.auth);
  const {
    data: myOrders,
    isLoading,
    error: errorLoading,
  } = useGetMyOrdersQuery();

  return (
    <>
      <Meta title='My Orders' />
      <h1>My Orders</h1>
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorBlock error={errorLoading} />
      ) : myOrders?.length === 0 ? (
        <p>You have no orders</p>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {myOrders?.map((order) => (
              <tr key={order.id}>
                <td>{order.sequenceOrderId}</td>
                <td>
                  {order.createdAt &&
                    dateTimeToLocaleDateString(order.createdAt)}
                </td>
                <td>
                  {CURRENCY_SYMBOL}
                  {order.totalAmounts.totalPrice.toFixed(2)}
                </td>
                <td>
                  {order.isPaid && order.paidAt ? (
                    dateTimeToLocaleDateString(order.paidAt)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered && order.deliveredAt ? (
                    dateTimeToLocaleDateString(order.deliveredAt)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <Link href={`${ORDER_DETAIL_PAGE}/${order.id}`}>
                    <Button className='btn-sm' variant='light'>
                      Details
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default MyOrdersScreen;
