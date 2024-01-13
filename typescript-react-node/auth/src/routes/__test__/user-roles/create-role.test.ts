import request from 'supertest';
import { app } from '../../../app';
import {
  fakeSignupAdmin,
  fakeSignupCustomer,
} from '../../../test/helper-functions';
import {
  ROLES_URL,
  Role,
  CUSTOMER_ROLE,
  CUSTOMER_DISPLAY,
} from '@orbital_app/common';

describe('Test create role', () => {
  it('creates a role with valid inputs and returns a status 201 with the created product', async () => {
    // Check that the Role database contains no records
    let roles = await Role.find({});
    expect(roles.length).toEqual(0);

    const res = await request(app)
      .post(ROLES_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({ role: CUSTOMER_ROLE, roleDisplay: CUSTOMER_DISPLAY });
    expect(res.status).toEqual(201);
    expect(res.body.role).toEqual(CUSTOMER_ROLE);

    // Check that the Role database contains one record
    roles = await Role.find({});
    expect(roles.length).toEqual(1);
    expect(roles[0].role).toEqual(CUSTOMER_ROLE);
    expect(roles[0].roleDisplay).toEqual(CUSTOMER_DISPLAY);
  });
  it('gives an authorization error (401) if the user is not logged in', async () => {
    await request(app)
      .post(ROLES_URL)
      .send({ role: CUSTOMER_ROLE, roleDisplay: CUSTOMER_DISPLAY })
      .expect(401);
  });
  it('gives an authorization error (401) if the user is signed in as customer role', async () => {
    await request(app)
      .post(ROLES_URL)
      .set('Cookie', fakeSignupCustomer())
      .send({ role: CUSTOMER_ROLE, roleDisplay: CUSTOMER_DISPLAY })
      .expect(401);
  });
  it('gives an 422 if 2 roles are created with the same details', async () => {
    await request(app)
      .post(ROLES_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({ role: CUSTOMER_ROLE, roleDisplay: CUSTOMER_DISPLAY })
      .expect(201);
    await request(app)
      .post(ROLES_URL)
      .set('Cookie', fakeSignupAdmin())
      .send({ role: CUSTOMER_ROLE, roleDisplay: CUSTOMER_DISPLAY })
      .expect(422);
  });
  // it('returns an error if an invalid role is provided', async () => {});
  // it('returns an error if an invalid roleDisplay is provided', async () => {});
});
