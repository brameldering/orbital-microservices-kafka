import express, { Response } from 'express';
import { body } from 'express-validator';
import {
  IExtendedRequest,
  validateRequest,
  protect,
  ObjectNotFoundError,
} from '@orbitelco/common';
import { User } from '../userModel';

const router = express.Router();

// @desc    Reset user password
// @route   PUT /api/users/v2/resetpassword
// @access  Private
// @req     req.currentUser.id (set by currentUser)
//          body {email}
// @res     status(200).message:'Password has been reset'
//       or status(404).ObjectNotFoundError('User not found')
router.put(
  '/api/users/v2/resetpassword',
  protect,
  [body('email').isEmail().withMessage('Email must be valid')],
  validateRequest,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Reset user password'
      #swagger.security = [{
        bearerAuth: ['user']
      }]
      #swagger.parameters['req.currentUser.id'] = {
              in: 'request',
              description: 'req.currentUser.id (set by currentUser)',
              required: 'true',
              type: 'string',
      }
      #swagger.parameters['email'] = {
          in: 'body',
          description: '{email} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[200] = {
          description: '{ message: Password has been reset }',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(User not found)',
     } */
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      user.password = process.env.DEFAULT_RESET_PASSWORD!;
      await user.save();
      res.status(200).send({});
    } else {
      throw new ObjectNotFoundError('User not found');
    }
  }
);

export { router as resetPasswordRouter };
