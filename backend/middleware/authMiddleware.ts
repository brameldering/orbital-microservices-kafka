import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler';
import { ExtendedError } from './errorMiddleware';
import { Response, NextFunction } from 'express';
import { IExtendedRequest } from 'types/commonTypes';

import User from '../user/userModel';

// User must be authenticated
const protect = asyncHandler(
  async (req: IExtendedRequest, res: Response, next: NextFunction) => {
    let token;

    if (!process.env.JWT_SECRET) {
      throw new ExtendedError('Error: missing setting in .env for JWT_SECRET');
    }

    // Read JWT from the 'jwt' cookie
    token = req.cookies.jwt;
    if (token) {
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

        console.log('=== authMiddleware.protect == decoded');
        console.log(decoded);
        console.log(decoded.userId);
        // Retrieve user object from DB minus the password field
        // and assign user object to req so it is available to all routes
        req.user = await User.findById(decoded.userId).select('-password');
        console.log('=== req.user');
        console.log(req.user);

        next();
      } catch (error) {
        console.error(error);
        throw new ExtendedError('Not authorized, token failed', 401);
      }
    } else {
      throw new ExtendedError('Not authorized, no token', 401);
    }
  }
);

// User must be an admin
const admin = (req: IExtendedRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    throw new ExtendedError('Not authorized, you must be an admin', 401);
  }
};

export { protect, admin };
