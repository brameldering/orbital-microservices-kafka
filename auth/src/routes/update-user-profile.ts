import express, { Response } from 'express';
import { body } from 'express-validator';
import {
  UPDATE_PROFILE_URL,
  IExtendedRequest,
  validateRequest,
  protect,
  ObjectNotFoundError,
} from '@orbitelco/common';

import { User } from '../userModel';

const router = express.Router();

// @desc    Update user profile (name, email)
// @route   PUT /api/users/v2/profile
// @access  Private
// @req     req.currentUser.id (set by currentUser)
//          body {name, email}
// @res     status(200).user
//       or status(400).RequestValidationError
//       or status(404).ObjectNotFoundError('User not found')
router.put(
  UPDATE_PROFILE_URL,
  protect,
  [
    body('name').trim().notEmpty().withMessage('Name can not be empty'),
    body('email').isEmail().withMessage('Email must be valid'),
  ],
  validateRequest,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Update user profile (name, email)'
      #swagger.security = [{
        bearerAuth: ['user']
      }]
      #swagger.parameters['req.currentUser.id'] = {
              in: 'request',
              description: 'req.currentUser.id, set by currentUser based on JWT session cookie if the user is logged in.',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['name, email'] = {
          in: 'body',
          description: '{name, email} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[200] = {
          description: '{updatedUser: IUserObj}',
      }
      #swagger.responses[400] = {
          description: 'RequestValidationError',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(User not found)',
     } */
    const { name, email } = req.body;

    const user = await User.findById(req?.currentUser?.id);
    if (user) {
      user.name = name;
      user.email = email;
      const updatedUser = await user.save();
      res.status(200).send({ updatedUser });
    } else {
      throw new ObjectNotFoundError('User not found');
    }
  }
);

export { router as updateUserProfileRouter };
