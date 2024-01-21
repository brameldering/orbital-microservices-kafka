import React from 'react';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Link from 'next/link';
import PAGES from 'constants/client-pages';

interface CheckoutStepsProps {
  currentStep: number;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const checkOutSteps = [
    { name: 'Cart', path: PAGES.CART_PAGE },
    { name: 'Address', path: PAGES.SHIPPING_PAGE },
    { name: 'Payment', path: PAGES.PAYMENT_INFO_PAGE },
    { name: 'Order', path: PAGES.PLACE_ORDER_PAGE },
  ];

  return (
    <List className='processFlow'>
      {checkOutSteps.map((element, index) => (
        <ListItem
          key={index}
          className={
            index < currentStep
              ? 'completed'
              : index === currentStep
              ? 'current'
              : 'todo'
          }>
          <Link href={element.path} passHref>
            <Button component='a' disabled={index >= currentStep}>
              {element.name}
            </Button>
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export default CheckoutSteps;
