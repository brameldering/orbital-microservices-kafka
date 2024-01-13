import request from 'supertest';
import { app } from '../../../app';
import { API_ACCESS_URL, MICROSERVICE_AUTH } from '@orbital_app/common';
import {
  createApiAccess,
  fakeSignupAdmin,
} from '../../../test/helper-functions';

describe('Test getting user roles', () => {
  it('returns a status 200 and list of api access records', async () => {
    // Create Api Access record
    await createApiAccess();

    // Get api access records
    const res = await request(app)
      .get(API_ACCESS_URL)
      .set('Cookie', fakeSignupAdmin())
      .send()
      .expect(200);
    // Check that response contains 1 record
    const result = res.body;
    expect(result.length).toEqual(1);
    expect(
      result.some((obj: any) => obj.microservice === MICROSERVICE_AUTH)
    ).toBe(true);
  });
});
