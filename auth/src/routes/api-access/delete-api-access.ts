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
} from '@orbitelco/common';

const router = express.Router();

// @desc    Delete api access record
// @route   DELETE /api/users/v2/apiaccess/:id
// @access  Admin
// @req     params.id
// @res     {}
//       or status(404).ObjectNotFoundError('apiaccess not found')
router.delete(
  API_ACCESS_URL + '/:id',
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  checkObjectId,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Delete apiaccess'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'apiaccess id',
            required: 'true',
            type: 'string'
      }
      #swagger.responses[200] = {
          description: 'Empty response',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(apiaccess not found)',
     } */
    const apiAccess = await ApiAccess.findById(req.params.id);
    if (apiAccess) {
      await apiAccess.deleteOne({ _id: apiAccess.id });

      // Refresh ApiAccess cache
      await apiAccessCache.loadCacheFromDB();

      // Publish ApiAccessDeletedEvent
      await kafkaWrapper.publishers[Topics.ApiAccessDeleted].publish({
        id: apiAccess.id,
        microservice: apiAccess.microservice,
        apiName: apiAccess.apiName,
      });

      res.send();
    } else {
      throw new ObjectNotFoundError('Api Access not found');
    }
  }
);

export { router as deleteApiAccessRouter };
