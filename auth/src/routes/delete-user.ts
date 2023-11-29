import express, { Request, Response } from 'express';
import {
  USERS_URL,
  User,
  checkObjectId,
  ObjectNotFoundError,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Delete user
// @route   DELETE /api/users/v2/:id
// @access  Admin
// @req     params.id
// @res     {}
//       or status(404).ObjectNotFoundError('User not found')
router.delete(
  USERS_URL + '/:id',
  checkObjectId,
  async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Delete user'
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
          description: 'Empty response',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(User not found)',
     } */
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      await User.deleteOne({ _id: user.id });
      res.send();
    } else {
      throw new ObjectNotFoundError('User not found');
    }
  }
);

export { router as deleteUserRouter };
