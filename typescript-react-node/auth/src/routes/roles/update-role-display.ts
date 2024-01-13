import express, { Response, NextFunction } from 'express';
import {
  ROLES_URL,
  Role,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  AUTH_APIS,
  checkObjectId,
  ObjectNotFoundError,
} from '@orbital_app/common';

const router = express.Router();

// @desc    Update the display name of a role record
// @route   PUT /api/users/v2/roles/:id
// @access  Admin
// @req     params.id
//          body {roleDisplay: string }
// @res     (updatedRole)
//       or status(404).ObjectNotFoundError(Role not found)
router.put(
  ROLES_URL + '/:id',
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  checkObjectId,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Update the display name of a role record'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
              in: 'path',
              description: 'Id of Role Record to update',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['{roleDisplay: string'] = {
              in: 'body',
              description: '{roleDisplay: string',
              required: 'true',
              type: 'object',
      }
      #swagger.responses[200] = {
            description: 'Updated Role Record'
      }
      #swagger.responses[404] = {
            description: 'ObjectNotFoundError(Role not found)'
      }
  } */
    const { roleDisplay } = req.body;
    const role = await Role.findById(req.params.id);
    if (role) {
      // role.role = role;
      role.roleDisplay = roleDisplay;
      const updatedRole = await role.save();
      res.send(updatedRole.toJSON());
    } else {
      throw new ObjectNotFoundError('Role not found');
    }
  }
);
export { router as updateRoleRouter };
