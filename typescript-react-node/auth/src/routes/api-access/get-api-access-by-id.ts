import express, { Response, NextFunction } from 'express';
import {
  API_ACCESS_URL,
  ApiAccess,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  AUTH_APIS,
  ObjectNotFoundError,
  checkObjectId,
} from '@orbital_app/common';

const router = express.Router();

// @desc    Get Api Access record by ID
// @route   GET /api/users/v2/apiaccess/:id
// @access  Admin
// @req     params.id
// @res     {Api Access Record}
//       or status(404).ObjectNotFoundError('Api Access not found')
router.get(
  API_ACCESS_URL + '/:id',
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  checkObjectId,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Get Api Access by ID'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'Api Access id',
            required: 'true',
            type: 'string'
      }
      #swagger.responses[200] = {
          description: '{Api Access}',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(Api Access not found)',
     } */
    const apiAccess = await ApiAccess.findById(req.params.id);
    if (apiAccess) {
      res.send(apiAccess.toJSON());
    } else {
      throw new ObjectNotFoundError('Api Access not found');
    }
  }
);

export { router as getApiAccessByIdRouter };
