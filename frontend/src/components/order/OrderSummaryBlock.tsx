import React from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import { CURRENCY_SYMBOL } from '../../constantsFrontend';

interface CurrencyFieldProps {
  label: string;
  amount: number;
}

interface OrderSummaryBlockProps {
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
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
          {Number(amount).toFixed(2)}
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

const OrderSummaryBlock: React.FunctionComponent<OrderSummaryBlockProps> = ({
  itemsPrice,
  shippingPrice,
  taxPrice,
  totalPrice,
}) => {
  return (
    <>
      <ListGroup.Item>
        <h2>Order Summary</h2>
      </ListGroup.Item>
      <CurrencyField label='Items' amount={itemsPrice} />
      <CurrencyField label='Shipping' amount={shippingPrice} />
      <CurrencyField label='Tax' amount={taxPrice} />
      <CurrencyField label='Total' amount={totalPrice} />
    </>
  );
};

export default OrderSummaryBlock;
