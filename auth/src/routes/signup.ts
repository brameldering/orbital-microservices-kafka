import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const user = User.build({ name, email, password });

    await user.save();

    generateToken(req, user.id.toString(), user.name, user.email);
    res.status(201).send(user);
  }
);

export { router as signupRouter };
