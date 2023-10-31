import express, { Response } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import {
  UPDATE_PASSWORD_URL,
  IExtendedRequest,
  validateRequest,
  protect,
  ObjectNotFoundError,
  UserInputError,
} from '@orbitelco/common';
import { User } from '../userModel';

const router = express.Router();

// @desc    Update user password
// @route   PUT /api/users/v2/updatepassword
// @access  Private
// @req     req.currentUser.id (set by currentUser)
//          body {currentPassword, newPassword}
// @res     status(200).send({updatedUser})
//       or status(400).RequestValidationError
//       or status(404).ObjectNotFoundError('User not found')
router.put(
  UPDATE_PASSWORD_URL,
  protect,
  [
    body('currentPassword')
      .trim()
      .isLength({ min: 6, max: 40 })
      .withMessage('Current password must be between 6 and 40 characters'),
    body('newPassword')
      .trim()
      .isLength({ min: 6, max: 40 })
      .withMessage('New password must be between 6 and 40 characters'),
  ],
  validateRequest,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Update user password'
      #swagger.security = [{
        bearerAuth: ['user']
      }]
      #swagger.parameters['req.currentUser.id'] = {
              in: 'request',
              description: 'req.currentUser.id (set by currentUser)',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['currentPassword, newPassword'] = {
          in: 'body',
          description: '{currentPassword, newPassword} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[200] = {
          description: '{ updatedUser }',
      }
      #swagger.responses[300] = {
          description: 'UserInputError(
          New password is the same as current password)',
      }
      #swagger.responses[300] = {
          description: 'UserInputError(Entered current password is incorrect)',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(User not found)',
     } */
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req?.currentUser?.id);
    if (user) {
      if (currentPassword !== newPassword) {
        if (
          user?.id &&
          (await bcrypt.compare(currentPassword, user.password))
        ) {
          user.password = newPassword;
          const updatedUser = await user.save();
          res.status(200).send({ updatedUser });
        } else {
          throw new UserInputError('Entered current password is incorrect');
        }
      } else {
        throw new UserInputError(
          'New password is the same as current password'
        );
      }
    } else {
      throw new ObjectNotFoundError('User not found');
    }
  }
);

export { router as updatePasswordRouter };
