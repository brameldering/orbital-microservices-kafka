// @ts-check
import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';

import { ExtendedError } from './errorMiddleware';


/**
 * Checks if the req.params.id is a valid Mongoose ObjectId.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next middleware function.
 * @throws {ExtendedError} Throws an error if the ObjectId is invalid.
 */

function checkObjectId(req: Request, res: Response, next: NextFunction) {
  if (!isValidObjectId(req.params.id)) {
    throw new ExtendedError(`Invalid ObjectId of:  ${req.params.id}`, 404);
  }
  next();
}

export default checkObjectId;
