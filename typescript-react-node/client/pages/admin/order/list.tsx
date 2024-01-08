import React from 'react';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { NextPageContext } from 'next';
import Link from 'next/link';
import FormTitle from 'form/FormTitle';
import FormTable from 'form/FormTable';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import { TITLE_ORDER_ADMIN } from 'constants/form-titles';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import { ORDER_DETAIL_PAGE } from 'constants/client-pages';
import { dateTimeToLocaleDateString } from 'utils/dateUtils';
import { getOrders } from 'api/orders/get-orders';
import { IOrder } from '@orbitelco/common';

interface TPageProps {
  orders: IOrder[];
  error?: string[];
}

const OrderListScreen: React.FC<TPageProps> = ({ orders, error }) => {
  return (
    <>
      <Meta title={TITLE_ORDER_ADMIN} />
      <FormTitle>{TITLE_ORDER_ADMIN}</FormTitle>
      {error ? (
        <ErrorBlock error={error} />
      ) : orders?.length === 0 ? (
        <p>There are no orders</p>
      ) : orders?.length === 0 ? (
        <p>There are no orders</p>
      ) : (
        <FormTable>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>USER</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>TOTAL</TableCell>
              <TableCell>PAID</TableCell>
              <TableCell>DELIVERED</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order, index) => (
              <TableRow
                key={order.id}
                sx={{
                  backgroundColor:
                    index % 2 ? 'background.default' : 'background.paper',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}>
                <TableCell>{order.sequentialOrderId}</TableCell>
                <TableCell>{order.user && order.user.name}</TableCell>
                <TableCell>
                  {order.createdAt &&
                    dateTimeToLocaleDateString(order.createdAt)}
                </TableCell>
                <TableCell>
                  {CURRENCY_SYMBOL}
                  {order.totalAmounts.totalPrice.toFixed(2)}
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt ? (
                    dateTimeToLocaleDateString(order.paidAt)
                  ) : (
                    <CloseIcon style={{ color: 'red' }} />
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt ? (
                    dateTimeToLocaleDateString(order.deliveredAt)
                  ) : (
                    <CloseIcon style={{ color: 'red' }} />
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`${ORDER_DETAIL_PAGE}/${order.id}`} passHref>
                    <Button variant='outlined' size='small'>
                      Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </FormTable>
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
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { orders: [], error: parsedError },
    };
  }
};

export default OrderListScreen;
