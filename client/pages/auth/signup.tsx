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
  const { doRequest, errors } = useRequest({
    url: 'https://orbitelco.dev/api/users/signup',
    method: 'post',
    body: { name, email, password },
    onSuccess: () => Router.push('/'),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data = await doRequest();
    console.log(data);
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
        {errors}
        <Button type='submit' variant='primary mt-2'>
          Sign Up
        </Button>{' '}
      </Form>
    </FormContainer>
  );
};

export default SignupScreen;
