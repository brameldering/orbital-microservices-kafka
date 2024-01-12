import express, { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  API_ACCESS_URL,
  ApiAccess,
  apiAccessCache,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  AUTH_APIS,
  validateRequest,
  kafkaWrapper,
  Topics,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Create a new api access entry
// @route   POST /api/users/v2/apiaccess
// @access  Admin
// @req     body {microservice: string, apiName: string, allowedRoles: [string]}
// @res     status(201).send(role)
//       or status(400).RequestValidationError
router.post(
  API_ACCESS_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  [
    body('apiName')
      .trim()
      .notEmpty()
      .withMessage('Api Name can not be empty')
      .custom((value) => {
        if (value.includes(' ')) {
          throw new Error('No spaces allowed in Api Name');
        }
        return true;
      }),
  ],
  validateRequest,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Create a new api access record'
      #swagger.parameters['apiName: string, microservice: string, allowedRoles: [string]'] = {
          in: 'body',
          description: '{apiName: string, microservice: string, allowedRoles: [string]',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[201] = {
          description: '{apiAccess})',
      }
      #swagger.responses[400] = {
          description: 'RequestValidationError',
      #swagger.responses[422] = {
          description: 'That object already exists',
      }
     } */
    const { apiName, microservice, allowedRoles } = req.body;

    const apiAccess = ApiAccess.build({ apiName, microservice, allowedRoles });
    await apiAccess.save();

    // Refresh ApiAccess cache
    await apiAccessCache.loadCacheFromDB();

    // Publish ApiAccessCreatedEvent
    await kafkaWrapper.publishers[Topics.ApiAccessCreated].publish(
      apiAccess.id,
      {
        id: apiAccess.id,
        apiName: apiAccess.apiName,
        microservice: apiAccess.microservice,
        allowedRoles: apiAccess.allowedRoles,
      }
    );

    res.status(201).send(apiAccess.toJSON());
  }
);

export { router as createApiAccessRouter };
