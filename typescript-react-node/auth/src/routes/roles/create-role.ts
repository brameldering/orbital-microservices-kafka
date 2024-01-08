import express, { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  ROLES_URL,
  Role,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  AUTH_APIS,
  validateRequest,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Create a new user role
// @route   POST /api/users/v2/roles
// @access  Admin
// @req     body {role, roleDisplay}
// @res     status(201).send(role)
//       or status(400).RequestValidationError
router.post(
  ROLES_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  [
    body('role').trim().notEmpty().withMessage('Role can not be empty'),
    body('roleDisplay')
      .trim()
      .notEmpty()
      .withMessage('RoleDisplay can not be empty'),
  ],
  validateRequest,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Create a new user role'
      #swagger.parameters['role, roleDisplay'] = {
          in: 'body',
          description: '{role, roleDisplay} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[201] = {
          description: '{role})',
      }
      #swagger.responses[400] = {
          description: 'RequestValidationError',
      #swagger.responses[422] = {
          description: 'That object already exists',
      }
     } */
    const { role, roleDisplay } = req.body;

    // TO DO: role is set to admin by default
    const roleObj = Role.build({ role, roleDisplay });

    await roleObj.save();
    res.status(201).send(roleObj.toJSON());
  }
);

export { router as createRoleRouter };
