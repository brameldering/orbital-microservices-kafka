import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { NextPageContext } from 'next';
import Link from 'next/link';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import { H1_PRICE_CALC_ADMIN } from 'constants/form-titles';
import { IPriceCalcSettingsAttrs } from '@orbitelco/common';
import { PRICE_CALC_EDIT_PAGE } from 'constants/client-pages';
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
      <Meta title={H1_PRICE_CALC_ADMIN} />
      <Row className='align-items-center my-0'>
        <Col>
          <h1>{H1_PRICE_CALC_ADMIN}</h1>
        </Col>
        <Col className='text-end'>
          <Link href={PRICE_CALC_EDIT_PAGE} style={{ marginRight: '10px' }}>
            <Button
              id={'BUTTON_edit_price_calc'}
              variant='primary'
              className='btn-sm'>
              <FaEdit /> Edit Price Calculation Settings
            </Button>
          </Link>
        </Col>
      </Row>
      {error ? (
        <ErrorBlock error={error} />
      ) : (
        <Row>
          <p>
            <strong>VAT Percentage: </strong> {priceCalcSettings.vatPercentage}
          </p>
          <p>
            <strong>Shipping Fee: </strong> {priceCalcSettings.shippingFee}
          </p>
          <p>
            <strong>Threshold Free Shipping: </strong>{' '}
            {priceCalcSettings.thresholdFreeShipping}
          </p>
        </Row>
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
  } catch (error) {
    const parsedError = parseError(error);
    return {
      props: { PriceCalcSettingsScreen: {}, error: parsedError },
    };
  }
};

export default PriceCalcSettingsScreen;
