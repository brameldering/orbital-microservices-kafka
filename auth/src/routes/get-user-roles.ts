import express, { Request, Response } from 'express';
import { ROLES_URL, Role } from '@orbitelco/common';

const router = express.Router();

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
  const userRolesOriginal = await Role.find({});
  // map users to json format as defined in user-types userSchema
  const userRoles = userRolesOriginal.map((role: { toJSON: () => any }) =>
    role.toJSON()
  );
  // console.log('userRoles', userRoles);
  res.send(userRoles);
});

export { router as getUserRolesRouter };
