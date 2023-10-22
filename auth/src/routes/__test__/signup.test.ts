import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on succesful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      name: 'juno',
      email: 'juno@test.com',
      password: 'password',
    })
    .expect(201);
});
