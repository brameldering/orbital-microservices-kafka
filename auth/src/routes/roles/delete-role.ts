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
} from '@orbitelco/common';

const router = express.Router();

// @desc    Delete role
// @route   DELETE /api/users/v2/roles/:id
// @access  Admin
// @req     params.id
// @res     {}
//       or status(404).ObjectNotFoundError('Role not found')
router.delete(
  ROLES_URL + '/:id',
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  checkObjectId,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Delete role'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'role id',
            required: 'true',
            type: 'string'
      }
      #swagger.responses[200] = {
          description: 'Empty response',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(Role not found)',
     } */
    const role = await Role.findById(req.params.id);
    if (role) {
      await role.deleteOne({ _id: role.id });
      res.send();
    } else {
      throw new ObjectNotFoundError('Role not found');
    }
  }
);

export { router as deleteRoleRouter };
