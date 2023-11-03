import React from 'react';
import { Form, Button } from 'react-bootstrap';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import useRequest from '../../hooks/use-request';
import FormContainer from '../../form/FormContainer';
import {
  FormField,
  PasswordField,
  SelectField,
} from '../../form/FormComponents';
import { textField, passwordField } from 'form/ValidationSpecs';
import { SIGN_UP_URL } from '@orbitelco/common';

interface IFormInput {
  name: string;
  email: string;
  password: string;
  role: string;
}

const schema = yup.object().shape({
  name: textField().required('Name is required'),
  email: textField()
    .required('Email is required')
    .email('Invalid email address'),
  password: passwordField(),
  role: yup.string().required('Role is required'),
});

const SignupScreen: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    // setValue,
    getValues,
    reset,
    // watch,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { name: '', email: '', password: '', role: '' },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const { doRequest, errors: apiErrors } = useRequest({
    url: 'https://orbitelco.dev' + SIGN_UP_URL,
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

  const roles = [
    { label: 'Select role', value: '' },
    { label: 'Customer', value: 'customer' },
    { label: 'Admin', value: 'admin' },
  ];

  const loadingOrProcessing = false;

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <h1 className='mb-4'>Sign Up</h1>
        <FormField
          controlId='name'
          label='Full Name'
          register={register}
          error={errors.name}
        />
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
        <SelectField
          controlId='role'
          options={roles}
          control={control}
          error={errors.role}
        />
        {apiErrors}
        <br />
        <Button
          type='submit'
          variant='primary mt-2'
          id='BUTTON_register'
          disabled={loadingOrProcessing || !isDirty}>
          Sign Up
        </Button>
      </Form>
    </FormContainer>
  );
};

export default SignupScreen;
