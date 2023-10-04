import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';

import ErrorMessage from '../../components/general/ErrorMessage';
import Loader from '../../components/general/Loader';
import Meta from '../../components/general/Meta';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';
import { dateTimeToLocaleDateString } from '../../utils/dateUtils';

const OrderListScreen = () => {
  const { data: orders, isLoading, error: errorLoading } = useGetOrdersQuery();

  return (
    <>
      <Meta title='Manage Orders' />
      <h1>Orders</h1>
      <p>test</p>
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorMessage error={errorLoading} />
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
            {orders && orders.length === 0 ? (
              <p>There are no orders</p>
            ) : (
              orders &&
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.sequenceOrderId}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>
                    {order.createdAt &&
                      dateTimeToLocaleDateString(order.createdAt)}
                  </td>
                  <td>${order.totalAmounts.totalPrice}</td>
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
                      <Button variant='light' className='btn-sm'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
