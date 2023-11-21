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
import useRequest from 'hooks/use-request';
import { BASE_URL } from 'constants/constants-frontend';
import { RESET_PASSWORD_URL } from '@orbitelco/common';

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

  const {
    doRequest,
    isProcessing,
    error: errorResettingPassword,
  } = useRequest({
    url: BASE_URL + RESET_PASSWORD_URL,
    method: 'put',
    onSuccess: () => Router.push('/auth/resetpasswordconfirm'),
  });
  const onSubmit = async () => {
    const email = getValues('email');
    await doRequest({ body: { email } });
  };

  const onError = (error: any) => {
    console.log('ERROR:::', error);
  };

  return (
    <FormContainer>
      <Meta title='Reset Password' />
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <h1>Reset Password</h1>
        {isProcessing && <Loader />}
        <FormField
          controlId='email'
          label='Your email address as known to us'
          register={register}
          error={errors.email}
        />
        {errorResettingPassword && (
          <ErrorBlock error={errorResettingPassword} />
        )}
        <Button
          id='BUTTON_reset_password'
          type='submit'
          variant='primary mt-2'
          disabled={isProcessing || !isDirty}>
          Reset Password
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PasswordResetScreen;
