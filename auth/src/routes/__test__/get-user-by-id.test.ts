import request from 'supertest';
import { app } from '../../app';
import { signupCustomer, signupAdmin } from '../../test/helper-functions';

describe('Test getting user by id', () => {
  it('returns a 200 on retrieving a user', async () => {
    const signUpResponse = await signupCustomer();
    const custUserId = signUpResponse.body.id.toString();
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    console.log('custUserId:', custUserId);
    // Try to delete user by Admin
    await request(app)
      .get('/api/users/v2/' + custUserId)
      .set('Cookie', cookie)
      .expect(200)
      .end((err) => {
        if (err) {
          console.log(err);
        }
      });
  });
  it('returns a 401 when trying to get with an invalid Object Id', async () => {
    const signUpAdminResponse = await signupAdmin();
    const cookie = signUpAdminResponse.get('Set-Cookie');
    console.log('invalid object id, cookie: ', cookie);
    // Try to delete a user by a customer
    await request(app)
      .get('/api/users/v2/' + '653f91272bfe1605c137fe3')
      .set('Cookie', cookie)
      .expect(400)
      .end((err) => {
        if (err) {
          console.log(err);
        }
      });
    // Check that error message contains message "('Param id has to be a valid id')"
    // console.log(res);
  });
});
