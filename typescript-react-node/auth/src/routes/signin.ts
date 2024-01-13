import express, { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import {
  SIGN_IN_URL,
  User,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  AUTH_APIS,
  validateRequest,
  NotAuthorizedError,
} from '@orbital_app/common';

import generateToken from '../utils/generateToken';

const router = express.Router();

// @desc    Authenticate user & construct JWT token
// @route   POST /api/users/v2/signin
// @access  Public
// @req     body {email, password}
// @res     stores jwt in httpOnly session cookie;
//      and send({ user })
//       or status(400).RequestValidationError
//       or status(401).NotAuthorizedError
router.post(
  SIGN_IN_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password can not be empty'),
  ],
  validateRequest,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Authenticate user & construct token using JSON Web Token.  On succesful authentication sets an HTTP Only Cookie with the encrypted jwt token'
      #swagger.parameters['email, password'] = {
          in: 'body',
          description: '{email, password} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[200] = {
          description: '{user}',
      }
      #swagger.responses[400] = {
          description: 'RequestValidationError',
      }
      #swagger.responses[401] = {
          description: 'NotAuthorizedError',
     } */
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user?.id && (await bcrypt.compare(password, user.password))) {
      generateToken(req, user.id.toString(), user.name, user.email, user.role);
      res.send(user.toJSON());
    } else {
      throw new NotAuthorizedError();
    }
  }
);

export { router as signinRouter };
