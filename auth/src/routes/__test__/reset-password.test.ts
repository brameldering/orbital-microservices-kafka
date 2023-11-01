import request from 'supertest';
import { app } from '../../app';
import { signupCustomer } from '../../test/helper-functions';
import {
  RESET_PASSWORD_URL,
  SIGN_IN_URL,
  CUST_TEST_EMAIL,
} from '@orbitelco/common';

const defaultResetPassword = process.env.DEFAULT_RESET_PASSWORD;

describe('Test resetting password', () => {
  it('returns a status 200 and the password is reset', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    // Reset password
    await request(app)
      .put(RESET_PASSWORD_URL)
      .set('Cookie', cookie)
      .send({
        email: CUST_TEST_EMAIL,
      })
      .expect(200);
    // Sign in with new reset password
    const res = await request(app)
      .post(SIGN_IN_URL)
      .send({
        email: CUST_TEST_EMAIL,
        password: defaultResetPassword,
      })
      .expect(200);
    // Check that user has logged in succesfully with new password
    expect(res.get('Set-Cookie')).toBeDefined();
  });
  it('returns a status 400 (RequestValidationError) when passing incorrect email', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    // Reset password
    const res = await request(app)
      .put(RESET_PASSWORD_URL)
      .set('Cookie', cookie)
      .send({
        email: 'invalid.email',
      })
      .expect(400);
    expect(res.text).toContain('Email must be valid');
  });
  it('returns a status 401 when not logged in', async () => {
    // Get customer user by admin
    const res = await request(app)
      .put(RESET_PASSWORD_URL)
      .send({
        email: CUST_TEST_EMAIL,
      })
      .expect(401);
    // Check that error message contains message "('Not authorized')"
    expect(res.text).toContain('Not authorized');
  });
  it('returns a status 404 when user is not found', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    // Reset password
    const res = await request(app)
      .put(RESET_PASSWORD_URL)
      .set('Cookie', cookie)
      .send({
        email: 'unknown.email@test.com',
      })
      .expect(404);
    // Check that error message contains message "('User not found')"
    expect(res.text).toContain('User not found');
  });
});
