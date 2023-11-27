import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import { ORDER_DETAIL_PAGE } from 'constants/client-pages';
import { dateTimeToLocaleDateString } from 'utils/dateUtils';
import { useGetOrdersQuery } from 'slices/ordersApiSlice';

const OrderListScreen = () => {
  const { data: orders, isLoading, error: errorLoading } = useGetOrdersQuery();

  return (
    <>
      <Meta title='Manage Orders' />
      <h1>Order Admin</h1>
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorBlock error={errorLoading} />
      ) : orders?.length === 0 ? (
        <p>There are no orders</p>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id}>
                <td>{order.sequenceOrderId}</td>
                <td>{order.user && order.user.name}</td>
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
                    <Button variant='light' className='btn-sm'>
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

export default OrderListScreen;
