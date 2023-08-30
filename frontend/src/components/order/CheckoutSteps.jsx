import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const CheckoutSteps = ({ currentStep }) => {
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
          }
        >
          <LinkContainer to={element.path}>
            <Nav.Link disabled={index >= currentStep}>{element.name}</Nav.Link>
          </LinkContainer>
        </li>
      ))}
    </ul>
  );
};

export default CheckoutSteps;
