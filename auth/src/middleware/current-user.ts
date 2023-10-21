import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IExtendedRequest, IReqUser } from '../types/request-types';

export const currentUser = (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_SECRET!
    ) as IReqUser;
    req.currentUser = payload;
  } catch (err) {
    // do nothing }
  }
  next();
};
