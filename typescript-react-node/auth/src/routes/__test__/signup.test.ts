import request from 'supertest';
import { app } from '../../app';
import { signupCustomer } from '../../test/helper-functions';
import {
  SIGN_UP_URL,
  CUST_TEST_NAME,
  CUST_TEST_EMAIL,
  CUST_TEST_PASSWORD,
  CUSTOMER_ROLE,
} from '@orbital_app/common';

describe('Test signup', () => {
  it('returns a status 201 on succesful signup', async () => {
    await signupCustomer();
  });
  it('sets a cookie after successful signup', async () => {
    const res = await request(app)
      .post(SIGN_UP_URL)
      .send({
        name: CUST_TEST_NAME,
        email: CUST_TEST_EMAIL,
        password: CUST_TEST_PASSWORD,
        role: CUSTOMER_ROLE,
      })
      .expect(201);
    expect(res.get('Set-Cookie')).toBeDefined();
  });
  it('returns a 400 with an invalid email', async () => {
    return request(app)
      .post(SIGN_UP_URL)
      .send({
        name: CUST_TEST_NAME,
        email: 'incorrect-email',
        password: CUST_TEST_PASSWORD,
        role: CUSTOMER_ROLE,
      })
      .expect(400);
  });
  it('returns a status 400 with an invalid password]', async () => {
    return request(app)
      .post(SIGN_UP_URL)
      .send({
        name: CUST_TEST_NAME,
        email: CUST_TEST_EMAIL,
        password: '2shrt',
        role: CUSTOMER_ROLE,
      })
      .expect(400);
  });
  it('returns a status 400 with an empty name, email, password or role]', async () => {
    await request(app)
      .post(SIGN_UP_URL)
      .send({
        name: '',
        email: CUST_TEST_EMAIL,
        password: CUST_TEST_PASSWORD,
        role: CUSTOMER_ROLE,
      })
      .expect(400);
    await request(app)
      .post(SIGN_UP_URL)
      .send({
        name: CUST_TEST_NAME,
        email: '',
        password: CUST_TEST_PASSWORD,
        role: CUSTOMER_ROLE,
      })
      .expect(400);
    await request(app)
      .post(SIGN_UP_URL)
      .send({
        name: CUST_TEST_NAME,
        email: CUST_TEST_EMAIL,
        password: '',
        role: CUSTOMER_ROLE,
      })
      .expect(400);
    await request(app)
      .post(SIGN_UP_URL)
      .send({
        name: CUST_TEST_NAME,
        email: CUST_TEST_EMAIL,
        password: CUST_TEST_PASSWORD,
        role: '',
      })
      .expect(400);
  });
  it('returns a status 422 when signing up twice with the same email', async () => {
    await signupCustomer();
    await request(app)
      .post(SIGN_UP_URL)
      .send({
        name: CUST_TEST_NAME,
        email: CUST_TEST_EMAIL,
        password: CUST_TEST_PASSWORD,
        role: CUSTOMER_ROLE,
      })
      .expect(422);
  });
});
