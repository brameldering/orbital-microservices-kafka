import React, { useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { NextPageContext } from 'next';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormContainer from '../../form/FormContainer';
import {
  FormField,
  PasswordField,
  SelectField,
} from '../../form/FormComponents';
import { textField, passwordField } from 'form/ValidationSpecs';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import { ISignUp, ICurrentUser } from 'types/user-types';
import { useSignUpMutation } from 'slices/usersApiSlice';
import { getCurrentUser } from 'api/get-current-user';

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

interface TPageProps {
  currentUser?: ICurrentUser;
}

const SignupScreen: React.FC<TPageProps> = ({ currentUser }) => {
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

  const [signUp, { isLoading: signinUp, error: errorSigninUp }] =
    useSignUpMutation();

  // Extract the 'redirect' query parameter with a default value of '/'
  const router = useRouter();
  const { query } = router;
  const redirect = query.redirect || '/';

  const onSubmit = async () => {
    const user: ISignUp = {
      name: getValues('name'),
      email: getValues('email'),
      password: getValues('password'),
      role: getValues('role'),
    };
    await signUp(user).unwrap();
    if (!errorSigninUp) {
      reset();
      Router.push('/');
    }
  };

  const onError = (error: any) => {
    console.log('ERROR:::', error);
  };

  useEffect(() => {
    if (currentUser) {
      router.push(redirect.toString());
    }
  }, [router, redirect, currentUser]);

  const roles = [
    { label: 'Select role', value: '' },
    { label: 'Customer', value: 'customer' },
    { label: 'Admin', value: 'admin' },
  ];

  const loadingOrProcessing = signinUp;

  return (
    <FormContainer>
      <Meta title='Sign Up' />
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <h1 className='mb-4'>Sign Up</h1>
        {loadingOrProcessing && <Loader />}
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
        {errorSigninUp && <ErrorBlock error={errorSigninUp} />}
        <br />
        <Button
          id='BUTTON_register'
          type='submit'
          variant='primary mt-2'
          disabled={loadingOrProcessing || !isDirty}>
          Sign Up
        </Button>
        <p>Currentuser:</p>
        <p>id: {currentUser?.id}</p>
        <p>email: {currentUser?.email}</p>
        <p>name: {currentUser?.name}</p>
        <p>role: {currentUser?.role}</p>
      </Form>
      <Row className='py-3'>
        <Col>
          Already have an account?{' '}
          <Link
            id='LINK_already_have_an_account'
            href={
              redirect ? `/auth/signin?redirect=${redirect}` : '/auth/signin'
            }>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const { data } = await getCurrentUser(context);
  return { props: data };
};

export default SignupScreen;
