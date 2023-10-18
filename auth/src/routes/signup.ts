import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError, DatabaseError } from '../types/error-types';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 40 })
      .withMessage('THe password must be between 6 and 40 characters'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;

    throw new DatabaseError();
    res.send('Hello Juno - signup ' + email + ' ' + password);
  }
);

export { router as signupRouter };
