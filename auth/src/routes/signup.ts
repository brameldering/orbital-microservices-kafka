import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@orbitelco/common';

import generateToken from '../utils/generateToken';
import { User } from '../userModel';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/users/v2/signup
// @access  Public
// @req     body {name, email, password}
// @res     status(201).send(user)
//       or status(400).RequestValidationError
router.post(
  '/api/users/v2/signup',
  [
    body('name').trim().notEmpty().withMessage('Name can not be empty'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 40 })
      .withMessage('Password must be between 6 and 40 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Register a new user'
      #swagger.parameters['name, email, password'] = {
          in: 'body',
          description: '{name, email, password} info of user',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[201] = {
          description: '{user})',
      }
      #swagger.responses[400] = {
          description: 'RequestValidationError',
     } */
    const { name, email, password } = req.body;

    // TO DO: role is set to admin by default
    const user = User.build({ name, email, password, role: 'admin' });

    await user.save();
    generateToken(req, user.id.toString(), user.name, user.email, user.role);
    res.status(201).send(user);
  }
);

export { router as signupRouter };
