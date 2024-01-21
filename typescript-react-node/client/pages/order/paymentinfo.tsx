import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import FormButtonBox from 'form/FormButtonBox';
import { SubmitButton } from 'form/FormButtons';
import Meta from 'components/Meta';
import CheckoutSteps from 'components/CheckoutSteps';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
import { savePaymentMethod } from 'slices/cartSlice';
import type { RootState } from 'slices/store';
import { PAYMENT_METHOD_PAYPAL } from '@orbital_app/common';

const PaymentScreen = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  /* If shippingAddress has not yet been filled then redirect */
  useEffect(() => {
    if (!shippingAddress.address) {
      Router.push(PAGES.SHIPPING_PAGE);
    }
  }, [shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD_PAYPAL);

  const { handleSubmit } = useForm({});

  const onSubmit = async () => {
    dispatch(savePaymentMethod(paymentMethod));
    Router.push(PAGES.PLACE_ORDER_PAGE);
  };

  return (
    <>
      <Meta title={TITLES.TITLE_PAYMENT_METHOD} />
      <CheckoutSteps currentStep={2} />
      <FormContainer>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>{TITLES.TITLE_PAYMENT_METHOD}</FormTitle>
          <FormControl component='fieldset'>
            <FormLabel component='legend'>Select Method</FormLabel>
            <RadioGroup
              aria-label='payment method'
              value={paymentMethod}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPaymentMethod(e.target.value)
              }
              name='paymentMethod'>
              <FormControlLabel
                value={PAYMENT_METHOD_PAYPAL}
                control={<Radio />}
                label='PayPal or Credit Card'
              />
            </RadioGroup>
          </FormControl>
          <FormButtonBox>
            <SubmitButton id='BUTTON_continue' label='Continue' />
          </FormButtonBox>
        </Box>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
