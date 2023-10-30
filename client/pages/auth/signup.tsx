/* eslint-disable no-undef */
import React, { useState, FormEvent } from 'react';
import { Form, Button } from 'react-bootstrap';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import FormContainer from '../../form/FormContainer';
import { FormField, PasswordField } from '../../form/FormComponents';

interface ISignupScreenProps {}

const SignupScreen: React.FC<ISignupScreenProps> = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const { doRequest, errors } = useRequest({
    url: 'https://orbitelco.dev/api/users/v2/signup',
    method: 'post',
    body: { name, email, password, role },
    onSuccess: () => Router.push('/'),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <h1 className='mb-4'>Sign Up</h1>
        <FormField
          controlId='name'
          label='Full Name'
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />
        <FormField
          controlId='email'
          label='Email Address'
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value)
          }
        />
        <PasswordField
          controlId='password'
          label='Password'
          value={password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
        />
        <Form.Select
          aria-label='Select Role'
          className='my-3'
          style={{ borderColor: '#606060' }}
          onChange={(e) => setRole(e.target.value)}>
          <option>Select role</option>
          <option value='customer'>Customer</option>
          <option value='admin'>Admin</option>
        </Form.Select>
        {errors}
        <Button type='submit' variant='primary mt-2'>
          Sign Up
        </Button>{' '}
      </Form>
    </FormContainer>
  );
};

export default SignupScreen;
