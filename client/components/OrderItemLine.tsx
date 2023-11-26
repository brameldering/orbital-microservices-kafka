import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import { PRODUCT_DETAIL_PAGE } from 'constants/client-pages';
import { IOrderItem } from '@orbitelco/common';

interface OrderItemLineProps {
  item: IOrderItem;
}

const OrderItemLine = (itemProps: OrderItemLineProps) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const item = itemProps.item;
  return (
    <Row>
      <Col md={1}>
        <Image src={item.imageURL} alt={item.productName} fluid />
      </Col>
      <Col>
        <Link
          href={`${PRODUCT_DETAIL_PAGE}/${item.productId}?goBackPath=${currentPath}`}>
          {item.productName}
        </Link>
      </Col>
      <Col md={4}>
        {item.qty} x {CURRENCY_SYMBOL}
        {item.price.toFixed(2)} = {CURRENCY_SYMBOL}
        {(item.qty * item.price).toFixed(2)}
      </Col>
    </Row>
  );
};

export default OrderItemLine;
