import request from 'supertest';
import { app } from '../../app';
import { signup } from '../../test/helper-functions';

describe('Test current-user', () => {
  it('responds with detail about the current user', async () => {
    const cookie = await signup();
    const res = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .send({})
      .expect(200);
    expect(res.body.currentUser.email).toEqual('juno@test.com');
  });
});
