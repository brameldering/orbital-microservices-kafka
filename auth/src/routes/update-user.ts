import express, { Request, Response } from 'express';
import {
  USERS_URL,
  protect,
  admin,
  checkObjectId,
  ObjectNotFoundError,
} from '@orbitelco/common';
import User from '../userModel';

const router = express.Router();

// @desc    Update user
// @route   PUT /api/users/v2/:id
// @access  Admin
// @req     params.id
//          body {name, email, role}
// @res     status(200).{user}
//       or status(404).ObjectNotFoundError('User not found')
router.put(
  USERS_URL + '/:id',
  protect,
  admin,
  checkObjectId,
  async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Update user'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['id'] = {
            in: 'path',
            description: 'user id',
            required: 'true',
            type: 'string'
      }
      #swagger.parameters['name, email, role'] = {
          in: 'body',
          description: '{name, email, role} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[200] = {
          description: 'updatedUser',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(User not found)',
     } */
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();
      res.status(200).send(updatedUser.toJSON());
    } else {
      throw new ObjectNotFoundError('User not found');
    }
  }
);

export { router as updateUserRouter };
