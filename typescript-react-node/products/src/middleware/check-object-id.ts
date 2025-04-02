// @ts-check
import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { UserInputError } from '../types/error-types';

export const checkObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!isValidObjectId(req.params.id)) {
    throw new UserInputError(`Invalid ObjectId: ${req.params.id}`);
  }
  next();
};
