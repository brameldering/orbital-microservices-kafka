import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import {
  RequestValidationError,
  AuthorizationError,
} from '../types/error-types';

import generateToken from '../utils/generateToken';
import { User } from '../models/userModel';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password can not be empty'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && user.id && (await bcrypt.compare(password, user.password))) {
      generateToken(res, user.id.toString(), user.email);
      res.status(200).json({ user });
    } else {
      throw new AuthorizationError('Invalid credentials');
    }
  }
);

export { router as signinRouter };
