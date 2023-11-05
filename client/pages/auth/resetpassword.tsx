import React from 'react';
import { Form, Button } from 'react-bootstrap';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormContainer from '../../form/FormContainer';
import { FormField } from '../../form/FormComponents';
import { textField } from 'form/ValidationSpecs';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import { useResetPasswordMutation } from 'slices/usersApiSlice';

interface IFormInput {
  email: string;
}

const schema = yup.object().shape({
  email: textField()
    .required('Email is required')
    .email('Invalid email address'),
});

const PasswordResetScreen = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { email: '' },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const [
    resetPassword,
    { isLoading: resettingPassword, error: errorResettingPassword },
  ] = useResetPasswordMutation();

  const onSubmit = async () => {
    const email = getValues('email');
    await resetPassword({ email }).unwrap();
    if (!errorResettingPassword) {
      Router.push('/auth/resetpasswordconfirm');
    }
  };

  const onError = (error: any) => {
    console.log('ERROR:::', error);
  };

  const loadingOrProcessing = resettingPassword;

  return (
    <FormContainer>
      <Meta title='Reset Password' />
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <h1>Reset Password</h1>
        {loadingOrProcessing && <Loader />}
        <FormField
          controlId='email'
          label='Your email address as known to us'
          register={register}
          error={errors.email}
        />
        {errorResettingPassword && (
          <ErrorBlock error={errorResettingPassword} />
        )}
        <br />
        <Button
          id='BUTTON_reset_password'
          type='submit'
          variant='primary mt-2'
          disabled={loadingOrProcessing || !isDirty}>
          Reset Password
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PasswordResetScreen;
