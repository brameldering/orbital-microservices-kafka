import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { API_ACCESS_URL, ApiAccess, validateRequest } from '@orbitelco/common';
import { ApiAccessCreatedPublisher } from '../../events/publishers/api-access-created-publisher';
// import { kafkaWrapper } from '../../kafka-wrapper';

const router = express.Router();

// @desc    Create a new api access entry
// @route   POST /api/users/v2/apiaccess
// @access  Admin
// @req     body {microservice: string, apiName: string, allowedRoles: [string]}
// @res     status(201).send(role)
//       or status(400).RequestValidationError
router.post(
  API_ACCESS_URL,
  [body('apiName').trim().notEmpty().withMessage('Api Name can not be empty')],
  validateRequest,
  async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Create a new api access record'
      #swagger.parameters['microservice: string, apiName: string, allowedRoles: [string]'] = {
          in: 'body',
          description: '{microservice: string, apiName: string, allowedRoles: [string]',
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
    const { microservice, apiName, allowedRoles } = req.body;

    const apiAccess = ApiAccess.build({ microservice, apiName, allowedRoles });
    await apiAccess.save();

    // Publish ApiAccessCreatedEvent
    new ApiAccessCreatedPublisher(
      'auth01',
      process.env.KAFKA_BROKERS!.split(',')
    ).publish({
      id: apiAccess.id,
      microservice: apiAccess.microservice,
      apiName: apiAccess.apiName,
      allowedRoles: apiAccess.allowedRoles,
    });

    res.status(201).send(apiAccess.toJSON());
  }
);

export { router as createApiAccessRouter };
