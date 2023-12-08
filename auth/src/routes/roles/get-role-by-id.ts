import express, { Request, Response } from 'express';
import {
  ROLES_URL,
  Role,
  ObjectNotFoundError,
  checkObjectId,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Get Role by ID
// @route   GET /api/users/v2/roles/:id
// @access  Admin
// @req     params.id
// @res     {Role Record}
//       or status(404).ObjectNotFoundError('Role not found')
router.get(
  ROLES_URL + '/:id',
  checkObjectId,
  async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Get Role by ID'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'Role id',
            required: 'true',
            type: 'string'
      }
      #swagger.responses[200] = {
          description: '{Role}',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(Role not found)',
     } */
    const role = await Role.findById(req.params.id);
    if (role) {
      res.send(role.toJSON());
    } else {
      throw new ObjectNotFoundError('Role not found');
    }
  }
);

export { router as getRoleByIdRouter };
