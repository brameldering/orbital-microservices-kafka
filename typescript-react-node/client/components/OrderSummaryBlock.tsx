import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import { ITotalAmounts } from '@orbitelco/common';

interface CurrencyFieldProps {
  label: string;
  amount: number;
}

interface OrderSummaryBlockProps {
  totalAmounts: ITotalAmounts;
}

const CurrencyField: React.FunctionComponent<CurrencyFieldProps> = ({
  label,
  amount,
}) => {
  return (
    <ListItem>
      <Grid container>
        <Grid item xs={6}>
          <Typography>{label}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>
            {CURRENCY_SYMBOL}
            {amount.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  );
};

const OrderSummaryBlock: React.FunctionComponent<OrderSummaryBlockProps> = ({
  totalAmounts,
}) => {
  console.log('OrderSummaryBlock', totalAmounts);
  return (
    <List>
      <ListItem>
        <Typography variant='h2'>Order Summary</Typography>
      </ListItem>
      <CurrencyField label='Items' amount={totalAmounts.itemsPrice} />
      <CurrencyField label='Shipping' amount={totalAmounts.shippingPrice} />
      <CurrencyField label='Tax' amount={totalAmounts.taxPrice} />
      <CurrencyField label='Total' amount={totalAmounts.totalPrice} />
    </List>
  );
};

export default OrderSummaryBlock;
