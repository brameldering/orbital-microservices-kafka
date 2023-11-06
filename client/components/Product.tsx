import React from 'react';
import Card from 'react-bootstrap/Card';
import Link from 'next/link';
import { CURRENCY_SYMBOL } from '../constants/constants-frontend';
import { IProduct } from '../types/product-types';

import Rating from './Rating';

interface ProductComponentProps {
  product: IProduct;
}

const Product: React.FunctionComponent<ProductComponentProps> = ({
  product,
}) => {
  return (
    <Card id='product_card' className='my-3 p-3 rounded'>
      <Link href={`/product/${product.id}`}>
        <Card.Img
          src={product.imageURL}
          alt={product.name}
          variant='top'
          img-fluid='true'
        />
      </Link>

      <Card.Body>
        <Link href={`/product/${product.id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>

        <Card.Text as='h3'>
          {CURRENCY_SYMBOL}
          {product.price.toFixed(2)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
