import express, { Request, Response } from 'express';
import {
  protect,
  admin,
  checkObjectId,
  ObjectNotFoundError,
} from '@orbitelco/common';
import { User } from '../userModel';

const router = express.Router();

// @desc    Get user by ID
// @route   GET /api/users/v2/:id
// @access  Admin
// @req     params.id
// @res     status(200).{user}
//       or status(404).ObjectNotFoundError('User not found')
router.get(
  '/api/users/v2/:id',
  protect,
  admin,
  checkObjectId,
  async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Get user by ID'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'user id',
            required: 'true',
            type: 'string'
      }
      #swagger.responses[200] = {
          description: '{user}',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(User not found)',
     } */
    console.log('req.params.id: ', req.params.id);
    const user = await User.findById(req.params.id);
    if (user) {
      console.log('get user by id, user', user);
      res.status(200).json(user);
    } else {
      throw new ObjectNotFoundError('User not found');
    }
  }
);

export { router as getUserByIdRouter };
