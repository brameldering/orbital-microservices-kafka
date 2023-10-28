import request from 'supertest';
import { app } from '../../app';
import {
  signup,
  TEST_NAME,
  TEST_EMAIL,
  TEST_PASSWORD,
} from '../../test/helper-functions';

describe('Test signup', () => {
  it('returns a 201 on succesful signup', async () => {
    await signup();
  });
  it('returns a 400 with an invalid email', async () => {
    return request(app)
      .post('/api/users/v2/signup')
      .send({
        name: TEST_NAME,
        email: 'incorrect-email',
        password: TEST_PASSWORD,
      })
      .expect(400);
  });
  it('returns a 400 with an invalid password]', async () => {
    return request(app)
      .post('/api/users/v2/signup')
      .send({
        name: TEST_NAME,
        email: TEST_EMAIL,
        password: '2shrt',
      })
      .expect(400);
  });
  it('returns a 400 with an empty name, email or empty password]', async () => {
    await request(app)
      .post('/api/users/v2/signup')
      .send({
        name: '',
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      })
      .expect(400);
    await request(app)
      .post('/api/users/v2/signup')
      .send({
        name: TEST_NAME,
        email: '',
        password: TEST_PASSWORD,
      })
      .expect(400);
    await request(app)
      .post('/api/users/v2/signup')
      .send({
        name: TEST_NAME,
        email: TEST_EMAIL,
        password: '',
      })
      .expect(400);
  });
  it('returns a 422 when signing up twice with the same email', async () => {
    await signup();
    await request(app)
      .post('/api/users/v2/signup')
      .send({
        name: TEST_NAME,
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      })
      .expect(422);
  });
  it('sets a cookie after successful signup', async () => {
    const res = await request(app)
      .post('/api/users/v2/signup')
      .send({
        name: TEST_NAME,
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      })
      .expect(201);
    expect(res.get('Set-Cookie')).toBeDefined();
  });
});
