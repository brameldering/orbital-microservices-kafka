import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Row, Col, Image } from 'react-bootstrap';
import { CURRENCY_SYMBOL } from '../../constantsFrontend';

const OrderItemLine = (itemProps) => {
  const currentPath = useLocation().pathname;
  const productId = itemProps.productId;
  const item = itemProps.item;
  return (
    <Row>
      <Col md={1}>
        <Image src={item.image} alt={item.name} fluid />
      </Col>
      <Col>
        <Link to={`/product/${productId}?goBackPath=${currentPath}`}>
          {item.name}
        </Link>
      </Col>
      <Col md={4}>
        {item.qty} x {CURRENCY_SYMBOL}
        {Number(item.price).toFixed(2)} = {CURRENCY_SYMBOL}
        {Number(item.qty * item.price).toFixed(2)}
      </Col>
    </Row>
  );
};

export default OrderItemLine;
