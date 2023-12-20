import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { TextNumField, PasswordField } from 'form/FormComponents';
import { textField, passwordField } from 'form/ValidationSpecs';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import { H1_SIGN_IN } from 'constants/form-titles';
import {
  PRODUCTS_PAGE,
  SIGNUP_PAGE,
  RESET_PASSWORD_PAGE,
} from 'constants/client-pages';
import { setUserState } from 'slices/authSlice';
import { useSignInMutation } from 'slices/usersApiSlice';

interface IFormInput {
  email: string;
  password: string;
}
const schema = yup.object().shape({
  email: textField().required('Required').email('Invalid email address'),
  password: passwordField(),
});

const SignInScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  // Extract the 'redirect' query parameter with a default value of PRODUCTS_PAGE
  const router = useRouter();
  const { query } = router;
  const redirect = query.redirect || PRODUCTS_PAGE;

  const [doSignIn, { isLoading: isProcessing, error: errorSigninIn }] =
    useSignInMutation();
  const onSubmit = async () => {
    const email = getValues('email');
    const password = getValues('password');
    try {
      const signedInUser = await doSignIn({ email, password }).unwrap();
      dispatch(setUserState(signedInUser));
      Router.push(redirect.toString());
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const onError = (error: any) => {
    console.error('ERROR:::', error);
  };

  return (
    <>
      <Meta title={H1_SIGN_IN} />
      <FormContainer>
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <FormTitle>{H1_SIGN_IN}</FormTitle>
          <TextNumField
            controlId='email'
            label='Email'
            register={register}
            error={errors.email}
            setError={setError}
          />
          <PasswordField
            controlId='password'
            label='Password'
            register={register}
            error={errors.password}
            setError={setError}
          />
          {errorSigninIn && <ErrorBlock error={errorSigninIn} />}
          <div className='d-flex mt-3 justify-content-between align-items-center'>
            <Button
              id='BUTTON_login'
              type='submit'
              variant='primary'
              disabled={isProcessing || !isDirty}>
              Sign In
            </Button>
          </div>
        </Form>
        <Row className='py-3'>
          <Col>
            New Customer?<span> </span>
            <Link
              id='LINK_register_new_customer'
              href={
                redirect ? `${SIGNUP_PAGE}?redirect=${redirect}` : SIGNUP_PAGE
              }>
              Register
            </Link>
          </Col>
        </Row>
        <Row>
          <Col>
            Password forgotten?<span> </span>
            <Link id='LINK_reset_password' href={RESET_PASSWORD_PAGE}>
              Reset password
            </Link>
          </Col>
        </Row>
        {isProcessing && <Loader />}
      </FormContainer>
    </>
  );
};

export default SignInScreen;
