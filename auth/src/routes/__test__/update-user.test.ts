import request from 'supertest';
import { app } from '../../app';
import {
  signupCustomer,
  signupCustomer2,
  signupAdmin,
} from '../../test/helper-functions';
import {
  USERS_URL,
  SIGN_IN_URL,
  CUST_TEST_EMAIL,
  CUST_TEST_PASSWORD,
  CUST_TEST_NAME,
} from '@orbitelco/common';

const updatedName = 'Updated Name';
const updatedEmail = 'updated.email@test.com';

describe('Test updating profile', () => {
  it('returns a status 200 when the name and role are updated, but email is left empty', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const custUserId = signUpResponse.body.id.toString();
    // Register an admin
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // update name and role
    await request(app)
      .put(USERS_URL + '/' + custUserId)
      .set('Cookie', cookie)
      .send({
        name: updatedName,
        role: 'admin',
      })
      .expect(200);
    // user signs in with existing email and password
    const res = await request(app)
      .post(SIGN_IN_URL)
      .send({
        email: CUST_TEST_EMAIL,
        password: CUST_TEST_PASSWORD,
      })
      .expect(200);
    // Check that user's name and role have changed, email is unchanged
    expect(res.get('Set-Cookie')).toBeDefined();
    expect(res.body.user.name).toEqual(updatedName);
    expect(res.body.user.email).toEqual(CUST_TEST_EMAIL);
    expect(res.body.user.role).toEqual('admin');
  });
  it('returns a status 200 when the email is updated and user can login with new email', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const custUserId = signUpResponse.body.id.toString();
    // Register an admin
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // update emaile
    await request(app)
      .put(USERS_URL + '/' + custUserId)
      .set('Cookie', cookie)
      .send({
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
    // Check that user has logged in succesfully with new password
    expect(res.get('Set-Cookie')).toBeDefined();
    expect(res.body.user.name).toEqual(CUST_TEST_NAME);
    expect(res.body.user.email).toEqual(updatedEmail);
    expect(res.body.user.role).toEqual('customer');
  });
  it('returns a status 401 when not logged in', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const custUserId = signUpResponse.body.id.toString();
    // try to update customer without being logged in
    const res = await request(app)
      .put(USERS_URL + '/' + custUserId)
      .send({
        name: updatedName,
        email: updatedEmail,
        role: 'admin',
      })
      .expect(401);
    // Check that error message contains message "('Not authorized')"
    expect(res.text).toContain('Not authorized');
  });
  it('returns a status 401 when logged in as a customer', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const custUserId = signUpResponse.body.id.toString();
    // Register another customer
    const signUpResponse2 = await signupCustomer2();
    const cookie = signUpResponse2.get('Set-Cookie');
    // try to update customer without being logged in
    const res = await request(app)
      .put(USERS_URL + '/' + custUserId)
      .set('Cookie', cookie)
      .send({
        name: updatedName,
        email: updatedEmail,
        role: 'admin',
      })
      .expect(401);
    // Check that error message contains message "('Not authorized')"
    expect(res.text).toContain('Not authorized');
  });
});
