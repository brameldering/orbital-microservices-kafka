import request from 'supertest';
import { app } from '../../../app';
import {
  ROLES_URL,
  CUSTOMER_ROLE,
  CUSTOMER_DISPLAY,
  ADMIN_ROLE,
  ADMIN_DISPLAY,
} from '@orbitelco/common';
import {
  createCustomerRole,
  createAdminRole,
} from '../../../test/helper-functions';

describe('Test getting user roles', () => {
  it('returns a status 200 and list of user roles', async () => {
    // Create customer role
    await createCustomerRole();
    await createAdminRole();

    // Get roles
    const res = await request(app).get(ROLES_URL).send().expect(200);
    // Check that response contains 2 records
    const result = res.body;
    expect(result.length).toEqual(2);
    expect(result.some((obj: any) => obj.role === CUSTOMER_ROLE)).toBe(true);
    expect(
      result.some((obj: any) => obj.roleDisplay === CUSTOMER_DISPLAY)
    ).toBe(true);
    expect(result.some((obj: any) => obj.role === ADMIN_ROLE)).toBe(true);
    expect(result.some((obj: any) => obj.roleDisplay === ADMIN_DISPLAY)).toBe(
      true
    );
  });
});
