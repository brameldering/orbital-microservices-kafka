import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import {
  signupCustomer,
  signupCustomer2,
  signupAdmin,
} from '../../test/helper-functions';
import { USERS_URL, CUST_TEST_NAME } from '@orbitelco/common';

describe('Test getting user by id', () => {
  it('returns a status 200 and the user on retrieving a user', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const custUserId = signUpResponse.body.id.toString();
    // Register an admin
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // Get customer user by admin
    const res = await request(app)
      .get(USERS_URL + '/' + custUserId)
      .set('Cookie', cookie)
      .send()
      .expect(200);
    expect(res.body.name).toEqual(CUST_TEST_NAME);
  });
  it('returns a status 300 when trying to get a user with an invalid object Id', async () => {
    // Register an admin
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // try to get a user using an invalid object id
    const dummyUserId = 'invalid_object_id';
    const res = await request(app)
      .get(USERS_URL + '/' + dummyUserId)
      .set('Cookie', cookie)
      .send()
      .expect(300);
    // Check that error message contains message "('Invalid ObjectId:')"
    expect(res.text.includes('Invalid ObjectId')).toEqual(true);
  });
  it('returns a status 401 when a customer tries to get a user', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const custUserId = signUpResponse.body.id.toString();
    // Register another customer user
    const signUpAdminResponse = await signupCustomer2();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // Get customer user by admin
    const res = await request(app)
      .get(USERS_URL + '/' + custUserId)
      .set('Cookie', cookie)
      .send()
      .expect(401);
    // Check that error message contains message "('Not authorized')"
    expect(res.text.includes('Not authorized')).toEqual(true);
  });
  it('returns a status 404 when user is not found', async () => {
    // Register an admin
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // Try to get a non-existing user
    const dummyUserId = new mongoose.Types.ObjectId().toHexString(); // Dummy but valid mongodb objectId
    const res = await request(app)
      .get(USERS_URL + '/' + dummyUserId)
      .set('Cookie', cookie)
      .send()
      .expect(404);
    // Check that error message contains message "('User not found')"
    expect(res.text.includes('User not found')).toEqual(true);
  });
});
