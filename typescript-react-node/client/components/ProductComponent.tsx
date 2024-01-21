import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import PAGES from 'constants/client-pages';
import { IProduct } from '@orbital_app/common';
import CustomRating from './Rating';

interface ProductComponentProps {
  product: IProduct;
}

const ProductComponent: React.FC<ProductComponentProps> = ({ product }) => {
  return (
    <Card sx={{ my: 3, p: 3, borderRadius: '4px' }} id='product_card'>
      <Link href={`${PAGES.PRODUCT_DETAIL_PAGE}/${product.id}`} passHref>
        <CardMedia
          component='img'
          image={product.imageURL}
          alt={product.name}
          sx={{ cursor: 'pointer' }} // To make the image act like a link
        />
      </Link>

      <CardContent>
        <Link href={`/product/${product.id}`} passHref>
          <Typography
            gutterBottom
            sx={{
              fontSize: '1rem',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
              color: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgb(255, 255, 255)'
                  : 'rgb(0, 0, 0)',
            }}>
            {product.name}
          </Typography>
        </Link>

        <Typography variant='h5'>
          <CustomRating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Typography>

        <Typography variant='h5'>
          {CURRENCY_SYMBOL}
          {product.price.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductComponent;
