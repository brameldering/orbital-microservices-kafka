// In common/cacheMiddleware.ts
import { Response, NextFunction } from 'express';
import { IExtendedRequest, apiAccessCache } from '@orbitelco/common';

export const cacheMiddleware = (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    req.apiAccessCache = apiAccessCache.cache;
    next();
  } catch (error) {
    next(error);
  }
};
