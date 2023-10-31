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
} from '@orbitelco/common';

describe('Test delete user', () => {
  it('returns a status 200 on succesfully deleting a user account', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const custUserId = signUpResponse.body.id.toString();
    // Register an admin
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // Delete customer user by Admin
    await request(app)
      .delete(USERS_URL + '/' + custUserId)
      .set('Cookie', cookie)
      .send()
      .expect(200);
    // Customer user can no longer log in
    const res = await request(app)
      .post(SIGN_IN_URL)
      .send({
        email: CUST_TEST_EMAIL,
        password: CUST_TEST_PASSWORD,
      })
      .expect(401);
    // Check that error message contains message "('User not found')"
    expect(res.text.includes('Not authorized')).toEqual(true);
  });
  it('returns a status 300 when an admin tries to delete with an invalid Object Id', async () => {
    // Register an admin
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // Try to delete a user with an invalid Object id
    const dummyUserId = 'invalid_object_id';
    const res = await request(app)
      .delete(USERS_URL + '/' + dummyUserId)
      .set('Cookie', cookie)
      .send()
      .expect(300);
    // Check that error message contains message "('Invalid ObjectId:')"
    expect(res.text.includes('Invalid ObjectId')).toEqual(true);
  });
  it('returns a status 401 when a customer tries to delete a user', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const custUserId = signUpResponse.body.id.toString();
    // Register another customer
    const signUpAdminResponse = await signupCustomer2();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // Try to delete a user by a customer
    const res = await request(app)
      .delete(USERS_URL + '/' + custUserId)
      .set('Cookie', cookie)
      .send()
      .expect(401);
    // Check that error message contains message "('Not authorized')"
    expect(res.text.includes('Not authorized')).toEqual(true);
  });
});
