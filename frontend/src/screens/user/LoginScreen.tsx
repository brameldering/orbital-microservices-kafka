import { useFormik } from 'formik';
import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import {
  EmailField,
  PasswordField,
} from '../../components/form/FormComponents';
import FormContainer from '../../components/form/FormContainer';
import {
  textField,
  passwordField,
} from '../../components/form/ValidationSpecs';
import ErrorMessage from '../../components/general/ErrorMessage';
import Loader from '../../components/general/Loader';
import Meta from '../../components/general/Meta';
import { setCredentials } from '../../slices/authSlice';
import { useLoginMutation } from '../../slices/usersApiSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading: loggingIn, error: errorLogginIn }] =
    useLoginMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: textField().required('Required').email('Invalid email address'),
      password: passwordField().required('Required'),
    }),
    onSubmit: async (values) => {
      const email = values.email;
      const password = values.password;
      try {
        const res = await login({ email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        console.log(err);
        // Do nothing because useLoginMutation will set errorLogin in case of an error
      }
    },
  });

  return (
    <FormContainer>
      <Meta title='Sign In' />
      <h1>Sign In</h1>
      {errorLogginIn && <ErrorMessage error={errorLogginIn} />}
      <Form onSubmit={formik.handleSubmit}>
        <EmailField controlId='email' label='Email' formik={formik} />
        <PasswordField controlId='password' label='Password' formik={formik} />
        <Button
          id='LoginScreen-login-button'
          disabled={loggingIn}
          type='submit'
          variant='primary mt-2'>
          Sign In
        </Button>
        {loggingIn && <Loader />}
      </Form>
      <Row className='py-3'>
        <Col>
          New Customer?<span> </span>
          <Link
            id='Login-screen-register_new_customer'
            to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          Password forgotten?<span> </span>
          <Link id='Login-screen-reset_password' to={'/passwordreset'}>
            Reset password
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
