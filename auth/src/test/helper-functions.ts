import request from 'supertest';
import { app } from '../app';
import {
  CUST_TEST_NAME,
  CUST_TEST_EMAIL,
  CUST_TEST_PASSWORD,
  CUST_TEST_ROLE,
  ADMIN_TEST_NAME,
  ADMIN_TEST_EMAIL,
  ADMIN_TEST_PASSWORD,
  ADMIN_TEST_ROLE,
} from '@orbitelco/common';

// Re-usable signup function for a test customer
export const signupCustomer: any = async () => {
  const signUpResponse = await request(app)
    .post('/api/users/v2/signup')
    .send({
      name: CUST_TEST_NAME,
      email: CUST_TEST_EMAIL,
      password: CUST_TEST_PASSWORD,
      role: CUST_TEST_ROLE,
    })
    .expect(201);

  // const id = signUpResponse.body.id;
  // const cookie = signUpResponse.get('Set-Cookie');
  return signUpResponse;
};

// Re-usable signup function for a second test customer
export const signupCustomer2: any = async () => {
  const signUpResponse = await request(app)
    .post('/api/users/v2/signup')
    .send({
      name: CUST_TEST_NAME,
      email: 'another.customer@test.com',
      password: CUST_TEST_PASSWORD,
      role: CUST_TEST_ROLE,
    })
    .expect(201);

  // const id = signUpResponse.body.id;
  // const cookie = signUpResponse.get('Set-Cookie');
  return signUpResponse;
};

// Re-usable signup function for an admin account
export const signupAdmin: any = async () => {
  const signUpResponse = await request(app)
    .post('/api/users/v2/signup')
    .send({
      name: ADMIN_TEST_NAME,
      email: ADMIN_TEST_EMAIL,
      password: ADMIN_TEST_PASSWORD,
      role: ADMIN_TEST_ROLE,
    })
    .expect(201);

  // const id = signUpResponse.body.id;
  // const cookie = signUpResponse.get('Set-Cookie');
  return signUpResponse;
};
