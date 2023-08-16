import { Row, Col, ListGroup } from 'react-bootstrap';
import { CURRENCY_SYMBOL } from '../constants';

const OrderSummaryBlock = (orderProp) => {
  const order = orderProp.order;
  return (
    <>
      <ListGroup.Item>
        <h2>Order Summary</h2>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Items</Col>
          <Col>
            {CURRENCY_SYMBOL}
            {order.itemsPrice}
          </Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Shipping</Col>
          <Col>
            {CURRENCY_SYMBOL}
            {order.shippingPrice}
          </Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Tax</Col>
          <Col>
            {CURRENCY_SYMBOL}
            {order.taxPrice}
          </Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Total</Col>
          <Col>
            {CURRENCY_SYMBOL}
            {order.totalPrice}
          </Col>
        </Row>
      </ListGroup.Item>
    </>
  );
};

export default OrderSummaryBlock;
