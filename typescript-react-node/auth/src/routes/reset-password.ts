import express, { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  RESET_PASSWORD_URL,
  User,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  AUTH_APIS,
  validateRequest,
  ObjectNotFoundError,
} from '@orbital_app/common';

const router = express.Router();

// @desc    Reset user password
// @route   PUT /api/users/v2/resetpassword
// @access  Public
// @req     req.currentUser.id (set by currentUser)
//          body {email}
// @res     message:'Password has been reset'
//       or status(404).ObjectNotFoundError('User not found')
router.put(
  RESET_PASSWORD_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
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
      #swagger.responses[400] = {
          description: 'RequestValidationError',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(User not found)',
     } */
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      user.password = process.env.DEFAULT_RESET_PASSWORD!;
      await user.save();
      res.send();
    } else {
      throw new ObjectNotFoundError('User not found');
    }
  }
);

export { router as resetPasswordRouter };
