import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Row, Col, Image } from 'react-bootstrap';
import { CURRENCY_SYMBOL } from '../../constantsFrontend';
import { IOrderItem } from '../../types/orderTypes';

interface OrderItemLineProps {
  item: IOrderItem;
}

const OrderItemLine = (itemProps: OrderItemLineProps) => {
  const currentPath = useLocation().pathname;
  const item = itemProps.item;
  return (
    <Row>
      <Col md={1}>
        <Image src={item.imageURL} alt={item.productName} fluid />
      </Col>
      <Col>
        <Link to={`/product/${item.productId}?goBackPath=${currentPath}`}>
          {item.productName}
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
