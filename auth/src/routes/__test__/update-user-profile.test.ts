import request from 'supertest';
import { app } from '../../app';
import { signupCustomer } from '../../test/helper-functions';
import {
  UPDATE_PROFILE_URL,
  SIGN_IN_URL,
  CUST_TEST_EMAIL,
  CUST_TEST_PASSWORD,
  CUST_TEST_NAME,
} from '@orbitelco/common';

const updatedName = 'Updated Name';
const updatedEmail = 'updated.email@test.com';
const invalidEmail = 'invalid.email';

describe('Test updating profile', () => {
  it('returns a status 200 when the name is updated', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    // update name
    await request(app)
      .put(UPDATE_PROFILE_URL)
      .set('Cookie', cookie)
      .send({
        name: updatedName,
        email: CUST_TEST_EMAIL,
      })
      .expect(200);
    // Sign in
    const res = await request(app)
      .post(SIGN_IN_URL)
      .send({
        email: CUST_TEST_EMAIL,
        password: CUST_TEST_PASSWORD,
      })
      .expect(200);
    // Check that user name has changed
    expect(res.get('Set-Cookie')).toBeDefined();
    expect(res.body.user.name).toEqual(updatedName);
  });
  it('returns a status 200 when the email is updated and can login with new email', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    // update email
    await request(app)
      .put(UPDATE_PROFILE_URL)
      .set('Cookie', cookie)
      .send({
        name: CUST_TEST_NAME,
        email: updatedEmail,
      })
      .expect(200);
    // Sign in with updated email
    const res = await request(app)
      .post(SIGN_IN_URL)
      .send({
        email: updatedEmail,
        password: CUST_TEST_PASSWORD,
      })
      .expect(200);
    // Check that the user's name has changed
    expect(res.get('Set-Cookie')).toBeDefined();
    expect(res.body.user.name).toEqual(CUST_TEST_NAME);
  });
  it('returns a status 400 (RequestValidationError) when name is empty', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    // update with empty name
    const res = await request(app)
      .put(UPDATE_PROFILE_URL)
      .set('Cookie', cookie)
      .send({
        name: '',
        email: CUST_TEST_EMAIL,
      })
      .expect(400);
    expect(res.text).toContain('Name can not be empty');
  });
  it('returns a status 400 (RequestValidationError) when entered email is invalid', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const cookie = signUpResponse.get('Set-Cookie');
    // try to update an invalid email
    const res = await request(app)
      .put(UPDATE_PROFILE_URL)
      .set('Cookie', cookie)
      .send({
        name: CUST_TEST_NAME,
        email: invalidEmail,
      })
      .expect(400);
    expect(res.text).toContain('Email must be valid');
  });
  it('returns a status 401 when not logged in', async () => {
    // Get customer user when not logged in
    const res = await request(app)
      .put(UPDATE_PROFILE_URL)
      .send({
        name: CUST_TEST_NAME,
        email: updatedEmail,
      })
      .expect(401);
    // Check that error message contains message "('Not authorized')"
    expect(res.text).toContain('Not authorized');
  });
});
