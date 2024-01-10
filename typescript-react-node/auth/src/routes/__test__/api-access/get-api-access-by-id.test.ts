import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import {
  createApiAccess,
  fakeSignupAdmin,
  fakeSignupCustomer,
  TEST_API_NAME,
} from '../../../test/helper-functions';
import {
  API_ACCESS_URL,
  ADMIN_ROLE,
  MICROSERVICE_AUTH,
} from '@orbitelco/common';

describe('Test getting api access record by id', () => {
  it('returns a status 200 and the api access record on retrieving a api access record', async () => {
    // Create Api Access record
    const resApiRecord = await createApiAccess();
    // Get Api Access record
    const res = await request(app)
      .get(API_ACCESS_URL + '/' + resApiRecord.body.id)
      .set('Cookie', fakeSignupAdmin())
      .send();
    expect(res.status).toEqual(200);
    expect(res.body.apiName).toEqual(TEST_API_NAME);
    expect(res.body.microservice).toEqual(MICROSERVICE_AUTH);
    expect(res.body.allowedRoles).toEqual([ADMIN_ROLE]);
  });
  it('returns a status 400 when trying to get a api access record with an invalid object Id', async () => {
    // try to get a api access record using an invalid object id
    const dummyApiAccessId = 'invalid_object_id';
    const res = await request(app)
      .get(API_ACCESS_URL + '/' + dummyApiAccessId)
      .set('Cookie', fakeSignupAdmin())
      .send()
      .expect(400);
    // Check that error message contains message "('Invalid ObjectId:')"
    expect(res.text).toContain('Invalid ObjectId');
  });
  it('returns a status 401 when a customer tries to get a api access record', async () => {
    // Create Api Access record
    const resApiRecord = await createApiAccess();
    // Get customer api access record by admin
    const res = await request(app)
      .get(API_ACCESS_URL + '/' + resApiRecord.body.id)
      .set('Cookie', fakeSignupCustomer())
      .send()
      .expect(401);
    // Check that error message contains message "('Not authorized')"
    expect(res.text).toContain('Not authorized');
  });
  it('returns a status 404 when api access record is not found', async () => {
    // Try to get a non-existing api access record
    const dummyApiAccessId = new mongoose.Types.ObjectId().toHexString(); // Dummy but valid mongodb objectId
    const res = await request(app)
      .get(API_ACCESS_URL + '/' + dummyApiAccessId)
      .set('Cookie', fakeSignupAdmin())
      .send()
      .expect(404);
    // Check that error message contains message "('Api Access not found')"
    expect(res.text).toContain('Api Access not found');
  });
});
