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
import { ICurrentUser } from 'types/user-types';
// import { useSignUpMutation } from 'slices/usersApiSlice';
import { getCurrentUser } from 'api/get-current-user';
import { getUserRoles } from 'api/get-user-roles';
import useRequest from 'hooks/use-request';
import { BASE_URL } from 'constants/constants-frontend';
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

interface TPageProps {
  currentUser?: ICurrentUser;
  roles: Array<{ role: string; desc: string }>;
}

const SignupScreen: React.FC<TPageProps> = ({ currentUser, roles }) => {
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

  // Extract the 'redirect' query parameter with a default value of '/'
  const router = useRouter();
  const { query } = router;
  const redirect = query.redirect || '/';

  const {
    doRequest,
    isProcessing,
    error: errorSigninUp,
  } = useRequest({
    url: BASE_URL + SIGN_UP_URL,
    method: 'post',
    onSuccess: () => {
      reset();
      Router.push('/');
    },
  });

  const onSubmit = async () => {
    const name = getValues('name');
    const email = getValues('email');
    const password = getValues('password');
    const role = getValues('role');
    await doRequest({ body: { name, email, password, role } });
  };

  const onError = (error: any) => {
    console.log('ERROR:::', error);
  };

  useEffect(() => {
    if (currentUser) {
      router.push(redirect.toString());
    }
  }, [router, redirect, currentUser]);

  const selectRoles = [
    { label: 'Select role', value: '' },
    ...roles.map((role) => ({ label: role.desc, value: role.role })),
  ];

  return (
    <FormContainer>
      <Meta title='Sign Up' />
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <h1 className='mb-4'>Sign Up</h1>
        {isProcessing && <Loader />}
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
          options={selectRoles}
          control={control}
          error={errors.role}
        />
        {errorSigninUp && <ErrorBlock error={errorSigninUp} />}
        <Button
          id='BUTTON_register'
          type='submit'
          variant='primary mt-2'
          disabled={isProcessing || !isDirty}>
          Sign Up
        </Button>
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

// Fetch User Roles (to fill dropdown box) and CurrentUser
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const { data } = await getCurrentUser(context);
    const roles = await getUserRoles(context);
    return {
      props: {
        currentUser: data.currentUser,
        roles: roles,
      },
    };
  } catch (error) {
    // Handle errors if any
    console.error('Error fetching data:', error);
    return {
      props: {
        currentUser: null,
        roles: [],
      },
    };
  }
};

export default SignupScreen;
