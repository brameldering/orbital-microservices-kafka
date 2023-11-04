import React from 'react';
import { Form, Button } from 'react-bootstrap';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useRequest from '../../hooks/use-request';
import FormContainer from '../../form/FormContainer';
import { FormField, PasswordField } from '../../form/FormComponents';
import { textField, passwordField } from 'form/ValidationSpecs';
import Meta from 'components/Meta';
import { SIGN_IN_URL } from '@orbitelco/common';

interface IFormInput {
  email: string;
  password: string;
}
const schema = yup.object().shape({
  email: textField()
    .required('Email is required')
    .email('Invalid email address'),
  password: passwordField(),
});

const SigninScreen: React.FC = () => {
  const {
    register,
    handleSubmit,
    // setValue,
    getValues,
    reset,
    // watch,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const { doRequest, errors: apiErrors } = useRequest({
    url: 'https://orbitelco.dev' + SIGN_IN_URL,
    method: 'post',
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async () => {
    const formData = getValues();
    console.log('getValues', formData);
    await doRequest({ body: formData });
    reset();
  };

  const onError = (error: any) => {
    console.log('ERROR:::', error);
  };

  const loadingOrProcessing = false;

  return (
    <FormContainer>
      <Meta title='Sign In' />
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <h1 className='mb-4'>Sign In</h1>
        <FormField
          controlId='email'
          label='Email'
          register={register}
          error={errors.email}
        />
        <PasswordField
          controlId='password'
          label='Password'
          register={register}
          error={errors.password}
        />
        {apiErrors}
        <br />
        <Button
          id='BUTTON_login'
          type='submit'
          variant='primary'
          disabled={loadingOrProcessing || !isDirty}>
          Sign In
        </Button>
      </Form>
    </FormContainer>
  );
};

export default SigninScreen;
