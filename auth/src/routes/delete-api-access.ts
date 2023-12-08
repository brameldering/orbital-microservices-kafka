import express, { Request, Response } from 'express';
import {
  API_ACCESS_URL,
  ApiAccess,
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
  checkObjectId,
  async (req: Request, res: Response) => {
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
      res.send();
    } else {
      throw new ObjectNotFoundError('apiAccess not found');
    }
  }
);

export { router as deleteApiAccessRouter };
