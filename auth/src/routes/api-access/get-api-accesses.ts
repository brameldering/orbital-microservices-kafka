import express, { Request, Response } from 'express';
import { API_ACCESS_URL, ApiAccess } from '@orbitelco/common';

const router = express.Router();

// @desc    Get all Api Access records
// @route   GET /api/users/v2/apiaccess
// @access  Admin
// @req
// @res     send(Api Access records)
router.get(API_ACCESS_URL, async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Fetch all api access records'
      #swagger.parameters[] = {},
      #swagger.responses[200] = {
          description: 'List of api access records[{microservice: string, apiName: string, allowedRoles: [string]}]',
} */
  const apiAccessesOriginal = await ApiAccess.find({});
  // map users to json format as defined in user-types userSchema
  const apiAccesses = apiAccessesOriginal.map(
    (apiAccess: { toJSON: () => any }) => apiAccess.toJSON()
  );
  res.send(apiAccesses);
});

export { router as getApiAccessesRouter };
