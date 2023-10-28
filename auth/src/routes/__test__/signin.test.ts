import request from 'supertest';
import { app } from '../../app';
import { signup, TEST_EMAIL, TEST_PASSWORD } from '../../test/helper-functions';

describe('Test signin', () => {
  it('returns a 200 on succesful signin', async () => {
    await signup();
    const res = await request(app)
      .post('/api/users/v2/signin')
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      })
      .expect(200);
    expect(res.get('Set-Cookie')).toBeDefined();
  });
  it('returns a 401 when signing in with unknown email', async () => {
    await request(app)
      .post('/api/users/v2/signin')
      .send({
        email: 'unknown@test.com',
        password: TEST_PASSWORD,
      })
      .expect(401);
  });
  it('returns a 401 when signing in with incorrect password', async () => {
    await signup();
    await request(app)
      .post('/api/users/v2/signin')
      .send({
        email: TEST_EMAIL,
        password: 'incorrect-password',
      })
      .expect(401);
  });
});
