import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { IdSequence } from '../seqIdModel';
import {
  ID_SEQUENCE_URL,
  validateRequest,
  ISequenceIdObj,
  protect,
  admin,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Create an id sequence
// @route   POST /api/idsequence/v2
// @access  Admin
// @req     body {sequenceName}
// @res     status(201).send()
//       or status(400).RequestValidationError
router.post(
  ID_SEQUENCE_URL,
  protect,
  admin,
  [
    body('sequenceName')
      .trim()
      .notEmpty()
      .withMessage('sequenceName can not be empty'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Sequence']
      #swagger.description = 'Create a sequence id record'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['sequenceName'] = {
          in: 'body',
          description: '{sequenceName} the name of the sequence id that will keep track of sequence ids',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[201] = {
          description: 'Empty',
      }
      #swagger.responses[400] = {
          description: 'RequestValidationError',
     }
     #swagger.responses[422] = {
          description: 'That object already exists',
     }
     */
    const { sequenceName } = req.body;
    const sequenceObject: ISequenceIdObj = {
      sequenceName,
      sequenceCounter: 0,
    };
    const idSequence = IdSequence.build(sequenceObject);
    await idSequence.save();
    res.status(201).send();
  }
);

export { router as createSequenceRecordRouter };
