import express, { Request, Response } from 'express';
import {
  USERS_URL,
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
  USERS_URL + '/:id',
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
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).send(user.toJSON());
    } else {
      throw new ObjectNotFoundError('User not found');
    }
  }
);

export { router as getUserByIdRouter };
