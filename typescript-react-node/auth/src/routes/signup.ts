import express, { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  SIGN_UP_URL,
  User,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  AUTH_APIS,
  validateRequest,
} from '@orbital_app/common';

import generateToken from '../utils/generateToken';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/users/v2/signup
// @access  Public
// @req     body {name, email, password, role}
// @res     status(201).send(user)
//       or status(400).RequestValidationError
router.post(
  SIGN_UP_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  [
    body('name').trim().notEmpty().withMessage('Name can not be empty'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 40 })
      .withMessage('Password must be between 6 and 40 characters'),
    body('role').trim().notEmpty().withMessage('Role can not be empty'),
  ],
  validateRequest,
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Register a new user'
      #swagger.parameters['name, email, password, role'] = {
          in: 'body',
          description: '{name, email, password, role} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[201] = {
          description: '{user})',
      }
      #swagger.responses[400] = {
          description: 'RequestValidationError',
      #swagger.responses[422] = {
          description: 'That object already exists',
      }
     } */
    const { name, email, password, role } = req.body;

    // TO DO: role is set to admin by default
    const user = User.build({ name, email, password, role });

    await user.save();
    generateToken(req, user.id.toString(), user.name, user.email, user.role);
    res.status(201).send(user.toJSON());
  }
);

export { router as signupRouter };
