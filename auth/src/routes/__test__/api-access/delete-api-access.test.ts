import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import {
  fakeSignupAdmin,
  fakeSignupCustomer,
  createApiAccess,
} from '../../../test/helper-functions';
import { API_ACCESS_URL, ApiAccess } from '@orbitelco/common';

describe('Test delete api access', () => {
  it('returns a status 200 after deleting an api access', async () => {
    // create api access
    const res = await createApiAccess();
    const id = res.body.id;

    // delete newly created api access
    await request(app)
      .delete(API_ACCESS_URL + '/' + id)
      .set('Cookie', fakeSignupAdmin())
      .send()
      .expect(200);

    // Try to fetch api access and chack it returns a 404 Not Found
    await request(app)
      .get(API_ACCESS_URL + '/' + id)
      .send();
    // Check that the ApiAccess database is empty
    const apiAccessRecords = await ApiAccess.find({});
    expect(apiAccessRecords.length).toEqual(0);
  });
  it('returns a status 400 when trying to delete an api access with an invalid object Id', async () => {
    const dummyApiAccessId = 'invalid_object_id';
    // try to update api access with invalid object id
    const res = await request(app)
      .delete(API_ACCESS_URL + '/' + dummyApiAccessId)
      .set('Cookie', fakeSignupAdmin())
      .send();
    // Check that error message contains message "('Invalid ObjectId:')"
    expect(res.status).toEqual(400);
    expect(res.text).toContain('Invalid ObjectId: ' + dummyApiAccessId);
  });
  it('gives an authorization error (401) if the user is not logged in', async () => {
    // create api access
    const res = await createApiAccess();
    const id = res.body.id;

    // try to delete newly created api access
    await request(app)
      .delete(API_ACCESS_URL + '/' + id)
      .send()
      .expect(401);
  });
  it('gives an authorization error (401) if the user is signed in as customer api access', async () => {
    // create api access
    const res = await createApiAccess();
    const id = res.body.id;

    //  try to update newly created api access
    await request(app)
      .delete(API_ACCESS_URL + '/' + id)
      .set('Cookie', fakeSignupCustomer())
      .send()
      .expect(401);
  });
  it('returns a status 404 if an api access is not found', async () => {
    const dummyApiAccessId = new mongoose.Types.ObjectId().toHexString(); // Dummy but valid mongodb objectId
    // try to update non-existing api access
    const res = await request(app)
      .delete(API_ACCESS_URL + '/' + dummyApiAccessId)
      .set('Cookie', fakeSignupAdmin())
      .send();
    // Check that error message contains message "('ApiAccess not found')"
    expect(res.status).toEqual(404);
    expect(res.text).toContain('Api Access not found');
  });
});
