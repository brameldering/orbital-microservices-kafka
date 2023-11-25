import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import FormContainer from 'form/FormContainer';
import Meta from 'components/Meta';
import CheckoutSteps from 'components/CheckoutSteps';
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
      Router.push('/shipping');
    }
  }, [shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const { handleSubmit } = useForm({});

  const onSubmit = async () => {
    dispatch(savePaymentMethod(paymentMethod));
    Router.push('/placeorder');
  };

  return (
    <FormContainer>
      {' '}
      <Meta title='Payment Method' />
      <CheckoutSteps currentStep={2} />
      <h1>Payment Method</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              className='my-2'
              type='radio'
              label='PayPal or Credit Card'
              id={PAYMENT_METHOD_PAYPAL}
              name='paymentMethod'
              value={PAYMENT_METHOD_PAYPAL}
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
          </Col>
        </Form.Group>
        <Button id='BUTTON_continue' type='submit' variant='primary mt-2'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
