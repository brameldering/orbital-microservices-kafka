import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { NextPageContext } from 'next';
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
import { ICurrentUser, ISignIn } from 'types/user-types';
import { useSignInMutation } from 'slices/usersApiSlice';
import { getCurrentUser } from 'api/get-current-user';

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

interface TPageProps {
  currentUser?: ICurrentUser;
}

const SigninScreen: React.FC<TPageProps> = ({ currentUser }) => {
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

  const [signIn, { isLoading: signinIn, error: errorSigninIn }] =
    useSignInMutation();

  // Extract the 'redirect' query parameter with a default value of '/'
  const router = useRouter();
  const { query } = router;
  const redirect = query.redirect || '/';

  const onSubmit = async () => {
    const user: ISignIn = {
      email: getValues('email'),
      password: getValues('password'),
    };
    await signIn(user).unwrap();
    if (!errorSigninIn) {
      reset();
      Router.push(redirect.toString());
    }
  };

  const onError = (error: any) => {
    console.log('ERROR:::', error);
  };

  const loadingOrProcessing = signinIn;

  return (
    <FormContainer>
      <Meta title='Sign In' />
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <h1 className='mb-4'>Sign In</h1>
        {loadingOrProcessing && <Loader />}
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
        <br />
        <Button
          id='BUTTON_login'
          type='submit'
          variant='primary mt-2'
          disabled={loadingOrProcessing || !isDirty}>
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
      <p>Currentuser:</p>
      <p>id: {currentUser?.id}</p>
      <p>email: {currentUser?.email}</p>
      <p>name: {currentUser?.name}</p>
      <p>role: {currentUser?.role}</p>
    </FormContainer>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { data } = await getCurrentUser(context);
  return { props: data };
};

export default SigninScreen;
