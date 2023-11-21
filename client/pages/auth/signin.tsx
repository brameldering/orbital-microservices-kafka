import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormContainer from '../../form/FormContainer';
import { FormField, PasswordField } from '../../form/FormComponents';
import { textField, passwordField } from 'form/ValidationSpecs';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
// import { useSignInMutation } from 'slices/usersApiSlice';
import useRequest from 'hooks/use-request';
import { BASE_URL } from 'constants/constants-frontend';
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
    getValues,
    reset,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  // Extract the 'redirect' query parameter with a default value of '/'
  const router = useRouter();
  const { query } = router;
  const redirect = query.redirect || '/';

  const {
    doRequest,
    isProcessing,
    error: errorSigninIn,
  } = useRequest({
    url: BASE_URL + SIGN_IN_URL,
    method: 'post',
    onSuccess: () => {
      reset();
      Router.push(redirect.toString());
    },
  });

  const onSubmit = async () => {
    const email = getValues('email');
    const password = getValues('password');
    await doRequest({ body: { email, password } });
  };

  const onError = (error: any) => {
    console.log('ERROR:::', error);
  };

  return (
    <FormContainer>
      <Meta title='Sign In' />
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <h1 className='mb-4'>Sign In</h1>
        {isProcessing && <Loader />}
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
        {errorSigninIn && <ErrorBlock error={errorSigninIn} />}
        <Button
          id='BUTTON_login'
          type='submit'
          variant='primary mt-2'
          disabled={isProcessing || !isDirty}>
          Sign In
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          New Customer?<span> </span>
          <Link
            id='LINK_register_new_customer'
            href={
              redirect ? `/auth/signup?redirect=${redirect}` : '/auth/signup'
            }>
            Register
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          Password forgotten?<span> </span>
          <Link id='LINK_reset_password' href={'/auth/resetpassword'}>
            Reset password
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default SigninScreen;
