import { NextFunction, Request, Response } from 'express';
// import { MongoError, MongoServerError } from 'mongodb';
import { CustomError } from '../types/error-types';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('errorHandler:', err);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  // MongoDB provides err.code which is 11000 to indicate dublicate unique field error.
  if (err.code && err.code === 11000) {
    console.log('Error code 11000');
    const message = err.keyValue
      ? `That ${Object.keys(err.keyValue)} already exists`
      : `That object already exists`;
    return res.status(422).send({ errors: [{ message: message }] });
  }

  // Default error
  res.status(500).send({ errors: [{ message: 'Something went wrong' }] });
  next();
};
