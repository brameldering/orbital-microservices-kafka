import request from 'supertest';
import { app } from '../../app';
import { ROLES_URL, CUSTOMER_ROLE, ADMIN_ROLE } from '@orbitelco/common';

describe('Test getting user roles', () => {
  it('returns a status 200 and list of user roles', async () => {
    // Get customer user by admin
    const res = await request(app).get(ROLES_URL).send().expect(200);
    // Check that response contains 3 records
    const result = res.body;
    expect(result.length).toEqual(2);
    expect(result.some((obj: any) => obj.role === CUSTOMER_ROLE)).toBe(true);
    expect(result.some((obj: any) => obj.desc === 'Customer')).toBe(true);
    expect(result.some((obj: any) => obj.role === ADMIN_ROLE)).toBe(true);
    expect(result.some((obj: any) => obj.desc === 'Admin')).toBe(true);
  });
});
