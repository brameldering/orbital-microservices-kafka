import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';
import bcrypt from 'bcryptjs';
import { AuthorizationError } from '../types/error-types';

import generateToken from '../utils/generateToken';
import { User } from '../models/userModel';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password can not be empty'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user?.id && (await bcrypt.compare(password, user.password))) {
      generateToken(req, user.id.toString(), user.name, user.email);
      res.status(200).send({ user });
    } else {
      throw new AuthorizationError('Invalid credentials');
    }
  }
);

export { router as signinRouter };
