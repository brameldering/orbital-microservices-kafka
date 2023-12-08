import express, { Request, Response } from 'express';
import {
  API_ACCESS_URL,
  ApiAccess,
  checkObjectId,
  ObjectNotFoundError,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Update the allowed roles of an api access record
// @route   PUT /api/users/v2/apiaccess/:id
// @access  Admin
// @req     params.id
//          body {allowedRoles }
// @res     (updatedApiAccess)
//       or status(404).ObjectNotFoundError(ApiAccess not found)
router.put(
  API_ACCESS_URL + '/:id',
  checkObjectId,
  async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Update the allowed roles of an api access record'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
              in: 'path',
              description: 'Id of Api Record to update',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['{allowedRoles: [string]'] = {
              in: 'body',
              description: '{allowedRoles: [string]',
              required: 'true',
              type: 'object',
      }
      #swagger.responses[200] = {
            description: 'Updated Api Record'
      }
      #swagger.responses[404] = {
            description: 'ObjectNotFoundError(Api Record not found)'
      }
  } */
    const { allowedRoles } = req.body;
    const apiAccess = await ApiAccess.findById(req.params.id);
    if (apiAccess) {
      // apiAccess.microservice = microservice;
      // apiAccess.apiName = apiName;
      apiAccess.allowedRoles = allowedRoles;
      const updatedApiAccess = await apiAccess.save();
      res.send(updatedApiAccess.toJSON());
    } else {
      throw new ObjectNotFoundError('Api Access not found');
    }
  }
);
export { router as updateApiAccessRolesRouter };
