import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError, DatabaseError } from '../types/error-types';

import generateToken from '../utils/generateToken';
import { User } from '../models/userModel';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('name').trim().notEmpty().withMessage('Name can not be empty'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 40 })
      .withMessage('Password must be between 6 and 40 characters'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { name, email, password } = req.body;

    const user = User.build({ name, email, password });

    const userRes = await user.save();

    if (userRes?._id && userRes.email) {
      generateToken(res, userRes._id.toString(), userRes.email);
      res.status(201).json(userRes);
    } else {
      throw new DatabaseError('Error in database while creating new user');
    }
  }
);

export { router as signupRouter };
