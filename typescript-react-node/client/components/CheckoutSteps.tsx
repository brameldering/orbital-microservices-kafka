import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Link from 'next/link';
import {
  CART_PAGE,
  SHIPPING_PAGE,
  PAYMENT_INFO_PAGE,
  PLACE_ORDER_PAGE,
} from 'constants/client-pages';

interface CheckoutStepsProps {
  currentStep: number;
}

const CheckoutSteps: React.FunctionComponent<CheckoutStepsProps> = ({
  currentStep,
}) => {
  const checkOutSteps = [
    { name: 'Cart', path: CART_PAGE },
    { name: 'Address', path: SHIPPING_PAGE },
    { name: 'Payment', path: PAYMENT_INFO_PAGE },
    { name: 'Order', path: PLACE_ORDER_PAGE },
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
