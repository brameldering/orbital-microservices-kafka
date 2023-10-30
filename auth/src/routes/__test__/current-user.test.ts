import request from 'supertest';
import { app } from '../../app';
import { CUST_TEST_EMAIL, CUST_TEST_ROLE } from '@orbitelco/common';
import { signupCustomer } from '../../test/helper-functions';

describe('Test current-user', () => {
  it('responds with detail about the current user', async () => {
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    const res = await request(app)
      .get('/api/users/v2/currentuser')
      .set('Cookie', cookie)
      .send({})
      .expect(200);
    expect(res.body.currentUser.email).toEqual(CUST_TEST_EMAIL);
    expect(res.body.currentUser.role).toEqual(CUST_TEST_ROLE);
  });
  it('responds with null when not authenticated', async () => {
    const res = await request(app)
      .get('/api/users/v2/currentuser')
      .send({})
      .expect(200);
    expect(res.body.currentUser).toEqual(null);
  });
});
