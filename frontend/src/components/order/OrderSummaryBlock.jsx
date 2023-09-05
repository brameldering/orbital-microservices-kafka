import { Row, Col, ListGroup } from 'react-bootstrap';
import { CURRENCY_SYMBOL } from '../../constantsFrontend';

const CurrencyField = ({ label, amount }) => {
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

const OrderSummaryBlock = (orderProp) => {
  const order = orderProp.order;
  return (
    <>
      <ListGroup.Item>
        <h2>Order Summary</h2>
      </ListGroup.Item>
      <CurrencyField label='Items' amount={order.itemsPrice} />
      <CurrencyField label='Shipping' amount={order.shippingPrice} />
      <CurrencyField label='Tax' amount={order.taxPrice} />
      <CurrencyField label='Total' amount={order.totalPrice} />
    </>
  );
};

export default OrderSummaryBlock;
