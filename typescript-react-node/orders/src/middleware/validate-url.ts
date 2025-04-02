import { Response, NextFunction } from 'express';
import { IExtendedRequest } from '../types/request-types';
import { ApplicationIntegrityError } from '../types/error-types';

// Test that URL does not contain "/?"
export const validateURL = (
  req: IExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const apiUrl = req.url;
  if (apiUrl.includes('/?')) {
    const errorMessage = 'URL should not contain /?, URL: ' + apiUrl;
    // console.log(errorMessage);
    throw new ApplicationIntegrityError(errorMessage);
  }
  next();
};
