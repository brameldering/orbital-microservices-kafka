import React from 'react';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import PAGES from 'constants/client-pages';
import { IOrderItem } from '@orbitelco/common';

interface OrderItemLineProps {
  item: IOrderItem;
  goBackPath: string;
}

const OrderItemLine = (itemProps: OrderItemLineProps) => {
  const item = itemProps.item;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={1}>
        <img
          src={item.imageURL}
          alt={item.productName}
          style={{ width: '100%', height: 'auto' }}
        />
      </Grid>
      <Grid item xs={12} md={7}>
        <Link
          href={`${PAGES.PRODUCT_DETAIL_PAGE}/${item.productId}?goBackPath=${itemProps.goBackPath}`}
          underline='hover'>
          <Typography variant='body1' component='span'>
            {item.productName}
          </Typography>
        </Link>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant='body1'>
          {item.qty} x {CURRENCY_SYMBOL}
          {item.price.toFixed(2)} = {CURRENCY_SYMBOL}
          {(item.qty * item.price).toFixed(2)}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default OrderItemLine;
