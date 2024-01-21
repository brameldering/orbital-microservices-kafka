import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import FormTitle from 'form/FormTitle';
import { TextNumField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import { textField } from 'form/ValidationSpecs';
import FormButtonBox from 'form/FormButtonBox';
import { BackButton, SubmitButton } from 'form/FormButtons';
import Meta from 'components/Meta';
import CheckoutSteps from 'components/CheckoutSteps';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
import { saveShippingAddress } from 'slices/cartSlice';
import type { RootState } from 'slices/store';

const ShippingScreen = () => {
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart);
  const { shippingAddress } = cart;

  interface IFormInput {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    postalCode: string;
    city: string;
    country: string;
  }

  const schema = yup.object().shape({
    firstName: textField().max(80).required('Required'),
    lastName: textField().max(80).required('Required'),
    address1: textField().max(80).required('Required'),
    address2: textField().max(80),
    postalCode: textField().max(12).required('Required'),
    city: textField().max(40).required('Required'),
    country: textField().max(40).required('Required'),
  });

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      firstName: '',
      lastName: '',
      address1: shippingAddress?.address || '',
      address2: '',
      postalCode: shippingAddress?.postalCode || '',
      city: shippingAddress?.city || '',
      country: shippingAddress?.country || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    // const firstName = getValues('firstName');
    // const lastName = getValues('lastName');
    const address1 = getValues('address1');
    // const address2 = getValues('address2');
    const postalCode = getValues('postalCode');
    const city = getValues('city');
    const country = getValues('country');
    dispatch(
      saveShippingAddress({ address: address1, postalCode, city, country })
    );
    Router.push(PAGES.PAYMENT_INFO_PAGE);
  };

  const goBack = async () => {
    Router.push(PAGES.CART_PAGE);
  };

  return (
    <>
      <Meta title={TITLES.TITLE_SHIPPING} />
      <CheckoutSteps currentStep={1} />
      <FormContainer>
        <FormTitle>{TITLES.TITLE_SHIPPING}</FormTitle>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12} sm={6}>
            <TextNumField
              controlId='firstName'
              label='First name'
              register={register}
              error={errors.firstName}
              setError={setError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextNumField
              controlId='lastName'
              label='Last name'
              register={register}
              error={errors.lastName}
              setError={setError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextNumField
              controlId='address1'
              label='Address line 1'
              register={register}
              error={errors.address1}
              setError={setError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextNumField
              controlId='address2'
              label='Address line 2'
              register={register}
              error={errors.address2}
              setError={setError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextNumField
              controlId='postalCode'
              label='Postal Code'
              register={register}
              error={errors.postalCode}
              setError={setError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextNumField
              controlId='city'
              label='City'
              register={register}
              error={errors.city}
              setError={setError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextNumField
              controlId='country'
              label='Country'
              register={register}
              error={errors.country}
              setError={setError}
            />
          </Grid>
          <FormButtonBox>
            <BackButton onClick={goBack} />
            <SubmitButton id='BUTTON_continue' label='Continue' />
          </FormButtonBox>
        </Box>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
