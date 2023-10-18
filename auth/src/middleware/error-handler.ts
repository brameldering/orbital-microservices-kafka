import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../types/error-types';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // Default error
  res.status(500).send({ errors: [{ message: 'Something went wrong' }] });
  next();
};
