/* eslint-disable no-undef */
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import FormContainer from '../../form/FormContainer';

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
        <h1>Sign Up</h1>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label className='mt-1 mb-0'>Name</Form.Label>
          <Form.Control
            name='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label className='mt-1 mb-0'>Email Address</Form.Label>
          <Form.Control
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='my-2' controlId='password'>
          <Form.Label className='mt-1 mb-0'>Password</Form.Label>
          <Form.Control
            type='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        {errors}
        <Button type='submit' variant='primary mt-2'>
          Sign Up
        </Button>{' '}
      </Form>
    </FormContainer>
  );
};

export default SignupScreen;
