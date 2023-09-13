import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import { ExtendedError } from './errorMiddleware.js';

import User from '../../user/models/userModel.js';

// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  // Read JWT from the 'jwt' cookie
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Retrieve user object from DB minus the password field
      // and assign user object to req so it is available to all routes
      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      console.error(error);
      throw new ExtendedError('Not authorized, token failed', 401);
    }
  } else {
    throw new ExtendedError('Not authorized, no token', 401);
  }
});

// User must be an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    throw new ExtendedError('Not authorized, you must be an admin', 401);
  }
};

export { protect, admin };
