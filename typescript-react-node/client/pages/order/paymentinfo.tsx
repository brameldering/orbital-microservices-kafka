import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { SubmitButton } from 'form/FormButtons';
import Meta from 'components/Meta';
import CheckoutSteps from 'components/CheckoutSteps';
import { TITLE_PAYMENT_METHOD } from 'constants/form-titles';
import { SHIPPING_PAGE, PLACE_ORDER_PAGE } from 'constants/client-pages';
import { savePaymentMethod } from 'slices/cartSlice';
import type { RootState } from 'slices/store';
import { PAYMENT_METHOD_PAYPAL } from '@orbitelco/common';

const PaymentScreen = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  /* If shippingAddress has not yet been filled then redirect */
  useEffect(() => {
    if (!shippingAddress.address) {
      Router.push(SHIPPING_PAGE);
    }
  }, [shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD_PAYPAL);

  const { handleSubmit } = useForm({});

  const onSubmit = async () => {
    dispatch(savePaymentMethod(paymentMethod));
    Router.push(PLACE_ORDER_PAGE);
  };

  return (
    <>
      <Meta title={TITLE_PAYMENT_METHOD} />
      <CheckoutSteps currentStep={2} />
      <FormContainer>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>{TITLE_PAYMENT_METHOD}</FormTitle>
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
          <SubmitButton id='BUTTON_continue' label='Continue' />
        </Box>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
