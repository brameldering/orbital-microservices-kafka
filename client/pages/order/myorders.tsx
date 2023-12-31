import React from 'react';
import { NextPageContext } from 'next';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormTitle from 'form/FormTitle';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import { TITLE_MY_ORDERS } from 'constants/form-titles';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import { ORDER_DETAIL_PAGE } from 'constants/client-pages';
import { dateTimeToLocaleDateString } from 'utils/dateUtils';
import { getMyOrders } from 'api/orders/get-my-orders';
import { IOrder } from '@orbitelco/common';

interface TPageProps {
  myOrders: IOrder[];
  error?: string[];
}

const MyOrdersScreen: React.FC<TPageProps> = ({ myOrders, error }) => {
  return (
    <>
      <Meta title={TITLE_MY_ORDERS} />
      <FormTitle>{TITLE_MY_ORDERS}</FormTitle>
      {error ? (
        <ErrorBlock error={error} />
      ) : myOrders?.length === 0 ? (
        <p>You have no orders</p>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label='simple table' size='small'>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>DATE</TableCell>
                <TableCell>TOTAL</TableCell>
                <TableCell>PAID</TableCell>
                <TableCell>DELIVERED</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {myOrders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.sequentialOrderId}</TableCell>
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
                      <CloseIcon color='error' />
                    )}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered && order.deliveredAt ? (
                      dateTimeToLocaleDateString(order.deliveredAt)
                    ) : (
                      <CloseIcon color='error' />
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
          </Table>
        </TableContainer>
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
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { myOrders: [], error: parsedError },
    };
  }
};

export default MyOrdersScreen;
