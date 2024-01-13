import request from 'supertest';
import { app } from '../../app';
import { signupCustomer } from '../../test/helper-functions';
import {
  SIGN_IN_URL,
  SIGN_OUT_URL,
  CUST_TEST_EMAIL,
  CUST_TEST_PASSWORD,
} from '@orbital_app/common';

describe('Test signout', () => {
  it('clears the cookie on succesful signout', async () => {
    // Sign up and sign-in
    await signupCustomer();
    const res = await request(app)
      .post(SIGN_IN_URL)
      .send({
        email: CUST_TEST_EMAIL,
        password: CUST_TEST_PASSWORD,
      })
      .expect(200);
    expect(res.get('Set-Cookie')).toBeDefined();
    // Signout and check that cookie is empty
    const res2 = await request(app).post(SIGN_OUT_URL).send().expect(200);
    expect(res2.get('Set-Cookie')[0]).toEqual(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
  });
});
