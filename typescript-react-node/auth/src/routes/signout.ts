import express, { Response, NextFunction } from 'express';
import {
  SIGN_OUT_URL,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  AUTH_APIS,
} from '@orbital_app/common';

const router = express.Router();

// @desc    Logout user / clear session cookie
// @route   POST /api/users/v2/signout
// @access  Public
// @req
// @res     Clear session cookie
router.post(
  SIGN_OUT_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(AUTH_APIS, req.apiAccessCache || [])(req, res, next),
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Users']
      #swagger.description = 'Clears the Session Cookie containing the JWT'
      #swagger.responses[200] = {
          description: 'Empty object',
      } */
    req.session = null;
    res.send();
  }
);

export { router as signoutRouter };
