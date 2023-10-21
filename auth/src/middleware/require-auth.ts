import { Response, NextFunction } from 'express';
import { IExtendedRequest } from '../types/request-types';
import { NotAuthorizedError } from '../types/error-types';

export const requireAuth = (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
