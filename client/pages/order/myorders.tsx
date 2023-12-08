import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { NextPageContext } from 'next';
import Link from 'next/link';
import Meta from 'components/Meta';
import { H1_MY_ORDERS } from 'constants/form-titles';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import { ORDER_DETAIL_PAGE } from 'constants/client-pages';
import { dateTimeToLocaleDateString } from 'utils/dateUtils';
import { getMyOrders } from 'api/orders/get-my-orders';
import { IOrder } from '@orbitelco/common';

interface TPageProps {
  myOrders: IOrder[];
}

const MyOrdersScreen: React.FC<TPageProps> = ({ myOrders }) => {
  return (
    <>
      <Meta title={H1_MY_ORDERS} />
      <h1>{H1_MY_ORDERS}</h1>
      {myOrders?.length === 0 ? (
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
                <td>{order.sequentialOrderId}</td>
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

// Fetch my orders, note that the API in the order MS will identify the user based on the session cookie
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const myOrders = await getMyOrders(context);
    return {
      props: { myOrders },
    };
  } catch (error) {
    // Handle errors if any
    console.error('Error fetching data:', error);
    return {
      props: { myOrders: [] },
    };
  }
};

export default MyOrdersScreen;
