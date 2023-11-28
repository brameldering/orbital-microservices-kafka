import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextNumField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import { textField } from 'form/ValidationSpecs';
import Meta from 'components/Meta';
import CheckoutSteps from 'components/CheckoutSteps';
import { H1_SHIPPING } from 'constants/form-titles';
import { PAYMENT_INFO_PAGE } from 'constants/client-pages';
import { saveShippingAddress } from 'slices/cartSlice';
import type { RootState } from 'slices/store';

const ShippingScreen = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  interface IFormInput {
    address: string;
    postalCode: string;
    city: string;
    country: string;
  }

  const schema = yup.object().shape({
    address: textField().required('Required'),
    postalCode: textField().required('Required'),
    city: textField().required('Required'),
    country: textField().required('Required'),
  });

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      address: shippingAddress?.address || '',
      postalCode: shippingAddress?.postalCode || '',
      city: shippingAddress?.city || '',
      country: shippingAddress?.country || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    const address = getValues('address');
    const postalCode = getValues('postalCode');
    const city = getValues('city');
    const country = getValues('country');
    dispatch(saveShippingAddress({ address, postalCode, city, country }));
    Router.push(PAYMENT_INFO_PAGE);
  };

  return (
    <>
      <Meta title={H1_SHIPPING} />
      <CheckoutSteps currentStep={1} />
      <FormContainer>
        <h1>{H1_SHIPPING}</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <TextNumField
            controlId='address'
            label='Address'
            register={register}
            error={errors.address}
            setError={setError}
          />
          <TextNumField
            controlId='postalCode'
            label='Postal Code'
            register={register}
            error={errors.postalCode}
            setError={setError}
          />
          <TextNumField
            controlId='city'
            label='City'
            register={register}
            error={errors.city}
            setError={setError}
          />
          <TextNumField
            controlId='country'
            label='Country'
            register={register}
            error={errors.country}
            setError={setError}
          />
          <Button id='BUTTON_continue' type='submit' variant='primary mt-2'>
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
