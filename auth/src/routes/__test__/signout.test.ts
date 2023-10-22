import request from 'supertest';
import { app } from '../../app';
import { signup, TEST_EMAIL, TEST_PASSWORD } from '../../test/helper-functions';

describe('Test signout', () => {
  it('clears the cookie on succesful signout', async () => {
    await signup();
    const res = await request(app)
      .post('/api/users/signin')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      })
      .expect(200);
    expect(res.get('Set-Cookie')).toBeDefined();
    const res2 = await request(app)
      .post('/api/users/signout')
      .send({})
      .expect(200);
    expect(res2.get('Set-Cookie')[0]).toEqual(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
  });
});
