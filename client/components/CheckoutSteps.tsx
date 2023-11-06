import React from 'react';
import { Nav } from 'react-bootstrap';
import Link from 'next/link';

interface CheckoutStepsProps {
  currentStep: number;
}

const CheckoutSteps: React.FunctionComponent<CheckoutStepsProps> = ({
  currentStep,
}) => {
  const checkOutSteps = [
    { name: 'Cart', path: '/cart' },
    { name: 'Address', path: '/shipping' },
    { name: 'Payment', path: '/payment' },
    { name: 'Order', path: '/placeorder' },
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
