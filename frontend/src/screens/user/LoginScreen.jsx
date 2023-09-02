import { useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  textField,
  passwordField,
} from '../../components/form/ValidationSpecs';
import FormContainer from '../../components/form/FormContainer';
import {
  EmailField,
  PasswordField,
} from '../../components/form/FormComponents';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import { ErrorMessage } from '../../components/general/Messages';
import { setCredentials } from '../../slices/authSlice';
import { useLoginMutation } from '../../slices/usersApiSlice';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: textField().required('required').email('Invalid email address'),
      password: passwordField().required('required'),
    }),
    onSubmit: async (values) => {
      const email = values.email;
      const password = values.password;
      try {
        const res = await login({ email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    },
  });

  return (
    <FormContainer>
      <Meta title='Sign In' />
      <h1>Sign In</h1>
      {error && <ErrorMessage error={error} />}
      <Form onSubmit={formik.handleSubmit}>
        <EmailField controlId='email' label='Email' formik={formik} />
        <PasswordField controlId='password' label='Password' formik={formik} />
        <Button disabled={isLoading} type='submit' variant='primary mt-2'>
          Sign In
        </Button>
        {isLoading && <Loader />}
      </Form>
      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
