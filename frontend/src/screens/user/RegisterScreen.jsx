import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/messages/ErrorMessage';
import FormContainer from '../../components/formComponents/FormContainer';
import {
  FormGroupTextEdit,
  FormGroupEmailEdit,
  FormGroupPasswordEdit,
} from '../../components/formComponents/FormGroupControls';
import Meta from '../../components/Meta';
import { useRegisterMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';
import { toast } from 'react-toastify';

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [register, { isLoading, error }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Meta title='Registration' />
      <FormContainer>
        <h1>Register</h1>
        {error && <ErrorMessage error={error} />}
        <Form onSubmit={submitHandler}>
          <FormGroupTextEdit
            controlId='name'
            label='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <FormGroupEmailEdit
            controlId='email'
            label='Email Address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormGroupPasswordEdit
            controlId='password'
            label='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormGroupPasswordEdit
            controlId='confirmPassword'
            label='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button disabled={isLoading} type='submit' variant='primary'>
            Register
          </Button>

          {isLoading && <Loader />}
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
    </>
  );
};

export default RegisterScreen;
