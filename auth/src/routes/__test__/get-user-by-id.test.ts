import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { signupCustomer, signupAdmin } from '../../test/helper-functions';

describe('Test getting user by id', () => {
  it('returns a 200 on retrieving a user', async () => {
    const signUpResponse = await signupCustomer();
    const custUserId = signUpResponse.body.id.toString();
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');

    await request(app)
      .get('/api/users/v2/' + custUserId)
      .set('Cookie', cookie)
      .send()
      .expect(200);
  });
  it('returns a 401 when trying to get user for a nonexisting but valid object Id', async () => {
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');

    const dummyUserId = new mongoose.Types.ObjectId().toHexString(); // Dummy but valid mongodb objectId
    await request(app)
      .get('/api/users/v2/' + dummyUserId)
      .set('Cookie', cookie)
      .expect(404);
    // Check that error message contains message "('User not found')"
  });
  it('returns a 300 when trying to get with an invalid object Id', async () => {
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');

    const dummyUserId = 'invalid_object_id';
    await request(app)
      .get('/api/users/v2/' + dummyUserId)
      .set('Cookie', cookie)
      .expect(300);
    // Check that error message contains message "('Invalid ObjectId:')"
  });
});
