/* eslint-disable no-undef */
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import FormContainer from '../../form/FormContainer';
import { FormField, PasswordField } from '../../form/FormComponents';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: 'https://orbitelco.dev/api/users/signup',
    method: 'post',
    body: { name, email, password },
    onSuccess: () => Router.push('/'),
  });

  const handleSubmit = async (e) => {
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
          onChange={(e) => setName(e.target.value)}
        />
        <FormField
          controlId='email'
          label='Email Address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordField
          controlId='password'
          label='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
