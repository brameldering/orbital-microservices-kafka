import request from 'supertest';
import { app } from '../../app';
import {
  CURRENT_USER_URL,
  CUST_TEST_EMAIL,
  CUSTOMER_ROLE,
} from '@orbital_app/common';
import { signupCustomer } from '../../test/helper-functions';

describe('Test current-user', () => {
  it('responds with detail about the current user', async () => {
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    const res = await request(app)
      .get(CURRENT_USER_URL)
      .set('Cookie', cookie)
      .send()
      .expect(200);
    expect(res.body.currentUser.email).toEqual(CUST_TEST_EMAIL);
    expect(res.body.currentUser.role).toEqual(CUSTOMER_ROLE);
  });
  it('responds with null when not authenticated', async () => {
    const res = await request(app).get(CURRENT_USER_URL).send().expect(200);
    expect(res.body.currentUser).toEqual(null);
  });
});
