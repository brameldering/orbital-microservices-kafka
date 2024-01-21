import { useState } from 'react';

export const useStepper = (initialStep = 0) => {
  const steps = ['Shipping address', 'Payment details', 'Review your order'];
  const [activeStep, setActiveStep] = useState(initialStep);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step: number) => {
    console.log(step);
    // switch (step) {
    //   case 0:
    //     return <AddressForm />;
    //   case 1:
    //     return <PaymentForm />;
    //   case 2:
    //     return <Review />;
    //   default:
    //     throw new Error('Unknown step');
    // }
  };

  return { steps, activeStep, handleNext, handleBack, getStepContent };
};
