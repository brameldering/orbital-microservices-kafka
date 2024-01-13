import request from 'supertest';
import { app } from '../../app';
import { signupCustomer } from '../../test/helper-functions';
import {
  UPDATE_PASSWORD_URL,
  SIGN_IN_URL,
  CUST_TEST_EMAIL,
  CUST_TEST_PASSWORD,
} from '@orbital_app/common';

const updatedPassword = 'UpdatedPassword';
const invalidPassword = 'short';

describe('Test updating password', () => {
  it('returns a status 200 and the password is updated', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    // Reset password
    await request(app)
      .put(UPDATE_PASSWORD_URL)
      .set('Cookie', cookie)
      .send({
        currentPassword: CUST_TEST_PASSWORD,
        newPassword: updatedPassword,
      })
      .expect(200);
    // Sign in with updated password
    const res = await request(app)
      .post(SIGN_IN_URL)
      .send({
        email: CUST_TEST_EMAIL,
        password: updatedPassword,
      })
      .expect(200);
    // Check that user has logged in succesfully with new password
    expect(res.get('Set-Cookie')).toBeDefined();
  });
  it('returns a status 400 (UserInputError) when new password is the same as current password', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    // Reset password
    const res = await request(app)
      .put(UPDATE_PASSWORD_URL)
      .set('Cookie', cookie)
      .send({
        currentPassword: CUST_TEST_PASSWORD,
        newPassword: CUST_TEST_PASSWORD,
      })
      .expect(400);
    expect(res.text).toContain('New password is the same as current password');
  });
  it('returns a status 400 (UserInputError) when entered current password is incorrect', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    // Reset password
    const res = await request(app)
      .put(UPDATE_PASSWORD_URL)
      .set('Cookie', cookie)
      .send({
        currentPassword: updatedPassword,
        newPassword: CUST_TEST_PASSWORD,
      })
      .expect(400);
    expect(res.text).toContain('Entered current password is incorrect');
  });
  it('returns a status 400 (RequestValidationError) when passing incorrect new password', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    // Reset password
    const res = await request(app)
      .put(UPDATE_PASSWORD_URL)
      .set('Cookie', cookie)
      .send({
        currentPassword: CUST_TEST_PASSWORD,
        newPassword: invalidPassword,
      })
      .expect(400);
    expect(res.text).toContain(
      'New password must be between 6 and 40 characters'
    );
  });
  it('returns a status 401 when not logged in', async () => {
    // Get customer user by admin
    const res = await request(app)
      .put(UPDATE_PASSWORD_URL)
      .send({
        currentPassword: CUST_TEST_PASSWORD,
        newPassword: updatedPassword,
      })
      .expect(401);
    // Check that error message contains message "('Not authorized')"
    expect(res.text).toContain('Not authorized');
  });
});
