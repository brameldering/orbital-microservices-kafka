import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { NextPageContext } from 'next';
import Link from 'next/link';
import Meta from 'components/Meta';
import { H1_ORDER_ADMIN } from 'constants/form-titles';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import { ORDER_DETAIL_PAGE } from 'constants/client-pages';
import { dateTimeToLocaleDateString } from 'utils/dateUtils';
import { getOrders } from 'api/orders/get-orders';
import { IOrder } from '@orbitelco/common';

interface TPageProps {
  orders: IOrder[];
}

const OrderListScreen: React.FC<TPageProps> = ({ orders }) => {
  return (
    <>
      <Meta title={H1_ORDER_ADMIN} />
      <h1>{H1_ORDER_ADMIN}</h1>
      {orders?.length === 0 ? (
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
                <td>{order.sequentialOrderId}</td>
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

// Fetch orders
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const orders = await getOrders(context);
    return {
      props: { orders },
    };
  } catch (error) {
    // Handle errors if any
    console.error('Error fetching data:', error);
    return {
      props: { orders: [] },
    };
  }
};

export default OrderListScreen;
