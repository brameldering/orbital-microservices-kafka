import { IRoleAttrs } from '../src/types/mongoose-model-types/mongoose-access-types';
import {
  ANONYMOUS_ROLE,
  ANONYMOUS_DISPLAY,
  CUSTOMER_ROLE,
  CUSTOMER_DISPLAY,
  ADMIN_ROLE,
  ADMIN_DISPLAY,
} from '../src/constants/role-constants';

export const roles: IRoleAttrs[] = [
  { role: ANONYMOUS_ROLE, roleDisplay: ANONYMOUS_DISPLAY },
  { role: CUSTOMER_ROLE, roleDisplay: CUSTOMER_DISPLAY },
  { role: ADMIN_ROLE, roleDisplay: ADMIN_DISPLAY },
];
