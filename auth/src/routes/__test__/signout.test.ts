import request from 'supertest';
import { app } from '../../app';
import { signupCustomer } from '../../test/helper-functions';
import { CUST_TEST_EMAIL, CUST_TEST_PASSWORD } from '@orbitelco/common';

describe('Test signout', () => {
  it('clears the cookie on succesful signout', async () => {
    await signupCustomer();
    const res = await request(app)
      .post('/api/users/v2/signin')
      .send({
        email: CUST_TEST_EMAIL,
        password: CUST_TEST_PASSWORD,
      })
      .expect(200);
    expect(res.get('Set-Cookie')).toBeDefined();
    const res2 = await request(app)
      .post('/api/users/v2/signout')
      .send({})
      .expect(200);
    expect(res2.get('Set-Cookie')[0]).toEqual(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
  });
});
