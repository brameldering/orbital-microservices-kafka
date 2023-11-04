import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Router from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// import useRequest from '../../hooks/use-request';
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
import { ISignUp } from 'types/user-types';
// import { BASE_URL } from 'constants/constants-frontend';
// import { SIGN_UP_URL } from '@orbitelco/common';
import { useSignUpMutation } from 'slices/usersApiSlice';

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
  const [signUp, { isLoading: signinUp, error: errorSigninUp }] =
    useSignUpMutation();

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

  // === Following to do in NextJS ===
  // const { search } = useLocation();
  // const sp = new URLSearchParams(search);
  // const redirect = sp.get('redirect') || '/';

  // useEffect(() => {
  //   if (userInfo) {
  //     navigate(redirect);
  //   }
  // }, [navigate, redirect, userInfo]);

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
      </Form>
      <Row className='py-3'>
        <Col>
          Already have an account?{' '}
          <Link id='LINK_already_have_an_account' href='/auth/signin'>
            {/* to={redirect ? `/login?redirect=${redirect}` : '/login'}> */}
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default SignupScreen;
