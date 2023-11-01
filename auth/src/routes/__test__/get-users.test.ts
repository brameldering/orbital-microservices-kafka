import request from 'supertest';
import { app } from '../../app';
import {
  signupCustomer,
  signupCustomer2,
  signupAdmin,
} from '../../test/helper-functions';
import { USERS_URL } from '@orbitelco/common';

describe('Test getting users', () => {
  it('returns a status 200 and list of users', async () => {
    // Register a customer user
    const signUpResponse = await signupCustomer();
    const custUserName1 = signUpResponse.body.name.toString();
    // Register another customer user
    const signUpResponse2 = await signupCustomer2();
    const custUserName2 = signUpResponse2.body.name.toString();
    // Register an admin
    const signUpAdminResponse = await signupAdmin();
    const adminName = signUpAdminResponse.body.name.toString();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // Get customer user by admin
    const res = await request(app)
      .get(USERS_URL)
      .set('Cookie', cookie)
      .send()
      .expect(200);
    // Check that response contains 3 records
    const result = res.body;
    expect(result.length).toEqual(3);
    expect(result.some((obj: any) => obj.name === custUserName1));
    expect(result.some((obj: any) => obj.name === custUserName2));
    expect(result.some((obj: any) => obj.name === adminName));
  });
  it('returns a status 401 when a customer tries to get user list', async () => {
    // Register a customer user
    await signupCustomer();
    // Register another customer user
    const signUpAdminResponse = await signupCustomer2();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    // Get customer user by admin
    const res = await request(app)
      .get(USERS_URL)
      .set('Cookie', cookie)
      .send()
      .expect(401);
    // Check that error message contains message "('Not authorized')"
    expect(res.text).toContain('Not authorized');
  });
});
