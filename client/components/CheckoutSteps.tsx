import React from 'react';
import { Nav } from 'react-bootstrap';
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
    <ul className='processFlow'>
      {checkOutSteps.map((element, index) => (
        <li
          key={index}
          className={
            index < currentStep
              ? 'completed'
              : index === currentStep
              ? 'current'
              : 'todo'
          }>
          <Nav.Link
            as={Link}
            href={element.path}
            disabled={index >= currentStep}>
            {element.name}
          </Nav.Link>
        </li>
      ))}
    </ul>
  );
};

export default CheckoutSteps;
