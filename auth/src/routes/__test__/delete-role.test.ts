import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import {
  fakeSignupAdmin,
  fakeSignupCustomer,
  createCustomerRole,
} from '../../test/helper-functions';
import { ROLES_URL, Role } from '@orbitelco/common';

describe('Test delete role', () => {
  it('returns a status 200 after deleting a role', async () => {
    // create role
    const res = await createCustomerRole();
    const id = res.body.id;

    // delete newly created role
    await request(app)
      .delete(ROLES_URL + '/' + id)
      .set('Cookie', fakeSignupAdmin())
      .send()
      .expect(200);

    // Try to fetch role and chack it returns a 404 Not Found
    await request(app)
      .get(ROLES_URL + '/' + id)
      .send();
    // Check that the Role database is empty
    const roles = await Role.find({});
    expect(roles.length).toEqual(0);
  });
  it('returns a status 400 when trying to delete a role with an invalid object Id', async () => {
    const dummRoleId = 'invalid_object_id';
    // try to update role with invalid object id
    const res = await request(app)
      .delete(ROLES_URL + '/' + dummRoleId)
      .set('Cookie', fakeSignupAdmin())
      .send();
    // Check that error message contains message "('Invalid ObjectId:')"
    expect(res.status).toEqual(400);
    expect(res.text).toContain('Invalid ObjectId: ' + dummRoleId);
  });
  it('gives an authorization error (401) if the user is not logged in', async () => {
    // create role
    const res = await createCustomerRole();
    const id = res.body.id;

    // try to delete newly created role
    await request(app)
      .delete(ROLES_URL + '/' + id)
      .send()
      .expect(401);
  });
  it('gives an authorization error (401) if the user is signed in as customer role', async () => {
    // create role
    const res = await createCustomerRole();
    const id = res.body.id;

    //  try to update newly created role
    await request(app)
      .delete(ROLES_URL + '/' + id)
      .set('Cookie', fakeSignupCustomer())
      .send()
      .expect(401);
  });
  it('returns a status 404 if a role is not found', async () => {
    const dummRoleId = new mongoose.Types.ObjectId().toHexString(); // Dummy but valid mongodb objectId
    // try to update non-existing role
    const res = await request(app)
      .delete(ROLES_URL + '/' + dummRoleId)
      .set('Cookie', fakeSignupAdmin())
      .send();
    // Check that error message contains message "('Role not found')"
    expect(res.status).toEqual(404);
    expect(res.text).toContain('Role not found');
  });
});
