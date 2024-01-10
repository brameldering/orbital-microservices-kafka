import React from 'react';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { NextPageContext } from 'next';
import FormTitle from 'form/FormTitle';
import Link from 'next/link';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import TITLES from 'constants/form-titles';
import { IPriceCalcSettingsAttrs } from '@orbitelco/common';
import PAGES from 'constants/client-pages';
import { getPriceCalcSettings } from 'api/orders/get-price-calc-settings';

interface TPageProps {
  priceCalcSettings: IPriceCalcSettingsAttrs;
  error?: string[];
}

const PriceCalcSettingsScreen: React.FC<TPageProps> = ({
  priceCalcSettings,
  error,
}) => {
  return (
    <>
      <Meta title={TITLES.TITLE_PRICE_CALC_ADMIN} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: 2,
        }}>
        <FormTitle>{TITLES.TITLE_PRICE_CALC_ADMIN}</FormTitle>
        <Link href={PAGES.PRICE_CALC_EDIT_PAGE} style={{ marginRight: '10px' }}>
          <Button
            id={'BUTTON_edit_price_calc'}
            variant='contained'
            startIcon={<EditIcon />}
            size='small'>
            Edit Price Calculation Settings
          </Button>
        </Link>
      </Box>
      {error ? (
        <ErrorBlock error={error} />
      ) : (
        <Paper elevation={2} sx={{ p: 2, mr: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>
                <strong>VAT Percentage: </strong>{' '}
                {priceCalcSettings.vatPercentage}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Shipping Fee: </strong> {priceCalcSettings.shippingFee}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Threshold Free Shipping: </strong>{' '}
                {priceCalcSettings.thresholdFreeShipping}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}
    </>
  );
};

// Fetch PriceCalcSettings
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const priceCalcSettings = await getPriceCalcSettings(context);
    return {
      props: { priceCalcSettings },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { PriceCalcSettingsScreen: {}, error: parsedError },
    };
  }
};

export default PriceCalcSettingsScreen;
