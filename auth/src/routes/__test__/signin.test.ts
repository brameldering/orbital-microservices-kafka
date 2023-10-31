import request from 'supertest';
import { app } from '../../app';
import { signupCustomer } from '../../test/helper-functions';
import { CUST_TEST_EMAIL, CUST_TEST_PASSWORD } from '@orbitelco/common';

describe('Test signin', () => {
  it('returns a status 200 on succesful signin', async () => {
    await signupCustomer();
    const res = await request(app)
      .post('/api/users/v2/signin')
      .send({
        email: CUST_TEST_EMAIL,
        password: CUST_TEST_PASSWORD,
      })
      .expect(200);
    expect(res.get('Set-Cookie')).toBeDefined();
  });
  it('returns a status 401 when signing in with unknown email', async () => {
    await signupCustomer();
    const res = await request(app)
      .post('/api/users/v2/signin')
      .send({
        email: 'unknown@test.com',
        password: CUST_TEST_PASSWORD,
      })
      .expect(401);
    // Check that error message contains message "('Not authorized')"
    expect(res.text.includes('Not authorized')).toEqual(true);
  });
  it('returns a status 401 when signing in with incorrect password', async () => {
    await signupCustomer();
    const res = await request(app)
      .post('/api/users/v2/signin')
      .send({
        email: CUST_TEST_EMAIL,
        password: 'incorrect-password',
      })
      .expect(401);
    // Check that error message contains message "('Not authorized')"
    expect(res.text.includes('Not authorized')).toEqual(true);
  });
});
