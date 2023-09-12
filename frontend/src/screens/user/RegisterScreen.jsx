import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  textField,
  passwordField,
} from '../../components/form/ValidationSpecs';
import FormContainer from '../../components/form/FormContainer';
import {
  TextField,
  EmailField,
  PasswordField,
} from '../../components/form/FormComponents';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import { ErrorMessage } from '../../components/general/Messages';
import { useRegisterMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';

function RegisterScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading: registering, error: errorRegistering }] =
    useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: textField().required('required'),
      email: textField().required('required').email('Invalid email address'),
      password: passwordField().required('required'),
    }),
    onSubmit: async (values) => {
      const name = values.name;
      const email = values.email;
      const password = values.password;
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        // Do nothing because the useRegisterMutation will set errorRegister
      }
    },
  });

  return (
    <FormContainer>
      <Meta title='Registration' />
      <h1>Register account</h1>
      {registering && <Loader />}
      {errorRegistering && <ErrorMessage error={errorRegistering} />}
      <Form onSubmit={formik.handleSubmit}>
        <TextField controlId='name' label='Full name' formik={formik} />
        <EmailField controlId='email' label='Email' formik={formik} />
        <PasswordField controlId='password' label='Password' formik={formik} />
        <Button disabled={registering} type='submit' variant='primary mt-2'>
          Register
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
}
export default RegisterScreen;
