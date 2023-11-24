import React from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';

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
    <ListGroup.Item>
      <Row>
        <Col>{label}</Col>
        <Col>
          {CURRENCY_SYMBOL}
          {amount.toFixed(2)}
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

const OrderSummaryBlock: React.FunctionComponent<OrderSummaryBlockProps> = ({
  totalAmounts,
}) => {
  console.log('OrderSummaryBlock', totalAmounts);
  return (
    <>
      <ListGroup.Item>
        <h2>Order Summary</h2>
      </ListGroup.Item>
      <CurrencyField label='Items' amount={totalAmounts.itemsPrice} />
      <CurrencyField label='Shipping' amount={totalAmounts.shippingPrice} />
      <CurrencyField label='Tax' amount={totalAmounts.taxPrice} />
      <CurrencyField label='Total' amount={totalAmounts.totalPrice} />
    </>
  );
};

export default OrderSummaryBlock;
