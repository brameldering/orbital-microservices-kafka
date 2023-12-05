import express, { Request, Response } from 'express';
import { ROLES_URL, CUSTOMER_ROLE, ADMIN_ROLE } from '@orbitelco/common';

const router = express.Router();

const ROLES = [
  { role: CUSTOMER_ROLE, desc: 'Customer' },
  { role: ADMIN_ROLE, desc: 'Admin' },
];

// @desc    Get all user roles
// @route   GET /api/users/v2/roles
// @access  Public
// @req
// @res     send(ROLES)
router.get(ROLES_URL, async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Fetch all user roles'
      #swagger.parameters[] = {},
      #swagger.responses[200] = {
          description: 'List of user roles [{role, desc}]',
} */
  console.log('In get-user-roles router.get ROLES_URL');
  res.json(ROLES).send();
});

export { router as getUserRolesRouter };
