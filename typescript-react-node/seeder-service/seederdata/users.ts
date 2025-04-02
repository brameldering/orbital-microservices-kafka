import bcrypt from 'bcryptjs';
import { CUSTOMER_ROLE, ADMIN_ROLE } from '../src/constants/role-constants';

export const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: ADMIN_ROLE,
  },
  {
    name: 'John Doe',
    email: 'john@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: CUSTOMER_ROLE,
  },
  {
    name: 'Jane Doe',
    email: 'jane@email.com',
    password: bcrypt.hashSync('123456', 10),
    role: CUSTOMER_ROLE,
  },
];
