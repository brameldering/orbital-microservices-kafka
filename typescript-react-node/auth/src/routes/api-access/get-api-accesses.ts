import express, { Response, NextFunction } from 'express';
import {
  API_ACCESS_URL,
  ApiAccess,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  AUTH_APIS,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Get all Api Access records
// @route   GET /api/users/v2/apiaccess
// @access  Admin
// @req
// @res     send(Api Access records)
router.get(
  API_ACCESS_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Fetch all api access records'
      #swagger.parameters[] = {},
      #swagger.responses[200] = {
          description: 'List of api access records[{apiName: string, microservice: string, allowedRoles: [string]}]',
} */
    const apiAccessesOriginal = await ApiAccess.find({});
    // map users to json format as defined in user-types userSchema
    const apiAccesses = apiAccessesOriginal.map(
      (apiAccess: { toJSON: () => any }) => apiAccess.toJSON()
    );
    res.send(apiAccesses);
  }
);

export { router as getApiAccessesRouter };
