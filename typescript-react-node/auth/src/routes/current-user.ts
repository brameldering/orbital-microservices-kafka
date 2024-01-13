import express, { Response, NextFunction } from 'express';
import {
  CURRENT_USER_URL,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  AUTH_APIS,
} from '@orbital_app/common';

const router = express.Router();

// @desc    Get current user
// @route   GET /api/users/v2/currentuser
// @access  Public
// @req     currentUser object
// @res     send({ currentUser: req.currentUser || null })
router.get(
  CURRENT_USER_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Get current user from req.currentUser object'
      #swagger.responses[200] = {
          description: '{ currentUser: req.currentUser || null }',
      } */
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
