import React from 'react';
import { Grid, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import { ITotalAmounts } from '@orbital_app/common';

interface CurrencyFieldProps {
  label: string;
  amount: number;
}

interface OrderSummaryBlockProps {
  totalAmounts: ITotalAmounts;
}

const CurrencyField: React.FC<CurrencyFieldProps> = ({ label, amount }) => {
  return (
    <ListItem>
      <Grid container>
        <Grid item xs={6}>
          <Typography>
            <strong>{label}</strong>
          </Typography>
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

const OrderSummaryBlock: React.FC<OrderSummaryBlockProps> = ({
  totalAmounts,
}) => {
  // console.log('OrderSummaryBlock', totalAmounts);
  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography variant='h2'>Order Summary</Typography>
      <CurrencyField label='Items' amount={totalAmounts.itemsPrice} />
      <CurrencyField label='Shipping' amount={totalAmounts.shippingPrice} />
      <CurrencyField label='Tax' amount={totalAmounts.taxPrice} />
      <CurrencyField label='Total' amount={totalAmounts.totalPrice} />
    </Box>
  );
};

export default OrderSummaryBlock;
