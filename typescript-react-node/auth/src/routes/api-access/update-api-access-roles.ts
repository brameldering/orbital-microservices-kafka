import express, { Response, NextFunction } from 'express';
import {
  API_ACCESS_URL,
  ApiAccess,
  apiAccessCache,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  AUTH_APIS,
  kafkaWrapper,
  Topics,
  checkObjectId,
  ObjectNotFoundError,
} from '@orbital_app/common';

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
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  checkObjectId,
  async (req: IExtendedRequest, res: Response) => {
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
      apiAccess.allowedRoles = allowedRoles;
      const updatedApiAccess = await apiAccess.save();

      // Refresh ApiAccess cache
      await apiAccessCache.loadCacheFromDB();

      // Publish ApiAccessUpdatedEvent
      await kafkaWrapper.publishers[Topics.ApiAccessUpdated].publish(
        apiAccess.id,
        {
          id: updatedApiAccess.id,
          apiName: updatedApiAccess.apiName,
          microservice: updatedApiAccess.microservice,
          allowedRoles: updatedApiAccess.allowedRoles,
        }
      );

      res.send(updatedApiAccess.toJSON());
    } else {
      throw new ObjectNotFoundError('Api Access not found');
    }
  }
);
export { router as updateApiAccessRolesRouter };
