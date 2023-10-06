import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

import ErrorMessage from '../../components/general/ErrorMessage';
import Loader from '../../components/general/Loader';
import Meta from '../../components/general/Meta';
import { useGetMyOrdersQuery } from '../../slices/ordersApiSlice';
import type { RootState } from '../../store';
import { dateTimeToLocaleDateString } from '../../utils/dateUtils';

const MyOrdersScreen = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const {
    data: orders,
    isLoading,
    error: errorLoading,
  } = useGetMyOrdersQuery(userInfo!._id);

  return (
    <>
      <Meta title='My Orders' />
      <h2>My Orders</h2>
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorMessage error={errorLoading} />
      ) : orders && orders.length === 0 ? (
        <p id='you-have-no-orders-message'>You have no orders</p>
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
            {orders &&
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.sequenceOrderId}</td>
                  <td>
                    {order.createdAt &&
                      dateTimeToLocaleDateString(order.createdAt)}
                  </td>
                  <td>{order.totalAmounts.totalPrice}</td>
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
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
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
