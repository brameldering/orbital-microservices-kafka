import React from 'react';
// import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
// import Link from 'next/link';
// import PAGES from 'constants/client-pages';

interface CheckoutStepsProps {
  currentStep: number;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const checkOutSteps = [
    { name: 'Cart' },
    { name: 'Address' },
    { name: 'Payment' },
    { name: 'Order' },
  ];
  // const checkOutSteps = [
  //   { name: 'Cart', path: PAGES.CART_PAGE },
  //   { name: 'Address', path: PAGES.SHIPPING_PAGE },
  //   { name: 'Payment', path: PAGES.PAYMENT_INFO_PAGE },
  //   { name: 'Order', path: PAGES.PLACE_ORDER_PAGE },
  // ];

  return (
    <Stepper activeStep={currentStep} sx={{ pt: 3, pb: 5 }}>
      {checkOutSteps.map((element, index) => (
        <Step key={index}>
          <StepLabel>{element.name}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutSteps;
