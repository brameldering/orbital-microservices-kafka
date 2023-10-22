import request from 'supertest';
import { app } from '../app';

export const TEST_NAME = process.env.TEST_NAME || '';
export const TEST_EMAIL = process.env.TEST_EMAIL || '';
export const TEST_PASSWORD = process.env.TEST_PASSWORD || '';

// Re-usable signup function
export const signup: any = async () => {
  const name = TEST_NAME;
  const email = TEST_EMAIL;
  const password = TEST_PASSWORD;
  const signUpResponse = await request(app)
    .post('/api/users/signup')
    .send({ name, email, password })
    .expect(201);
  const cookie = signUpResponse.get('Set-Cookie');
  return cookie;
};
