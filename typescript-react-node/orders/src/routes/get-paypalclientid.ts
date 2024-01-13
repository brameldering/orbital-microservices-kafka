import express, { Response, NextFunction } from 'express';
import {
  GET_PAYPAL_CLIENT_ID_URL,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  ORDERS_APIS,
} from '@orbital_app/common';

const router = express.Router();

// @desc    Get PayPal client id from .env
// @route   GET /api/config/v2/paypalclientid
// @access  Public
// @req
// @res     status(200).json({ clientId })
router.get(
  GET_PAYPAL_CLIENT_ID_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(ORDERS_APIS, req.apiAccessCache || [])(req, res, next),
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Config']
      #swagger.description = 'Get PayPal client id from .env'
      #swagger.responses[200] = {
          description: 'json({ clientId })',
} */
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
  }
);

export { router as getPayPalClientIdRouter };
