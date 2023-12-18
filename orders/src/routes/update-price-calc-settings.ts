import express, { Response, NextFunction } from 'express';
import {
  PRICE_CALC_SETTINGS_URL,
  IExtendedRequest,
  cacheMiddleware,
  authorize,
  ORDERS_APIS,
  PriceCalcSettings,
  IPriceCalcSettingsDoc,
  ObjectNotFoundError,
} from '@orbitelco/common';

const router = express.Router();

// @desc    Update Price Calculation Settings
// @route   PUT /api/orders/v2/pricecalcsettings
// @access  Admin
// @req     body {name, email, role}
// @res     {updated PriceCalcSettingsObj}
router.put(
  PRICE_CALC_SETTINGS_URL,
  cacheMiddleware,
  (req: IExtendedRequest, res: Response, next: NextFunction) =>
    authorize(ORDERS_APIS, req.apiAccessCache || [])(req, res, next),
  async (req: IExtendedRequest, res: Response) => {
    /*  #swagger.tags = ['Orders']
      #swagger.description = 'Update Price Calculation Settings'
      #swagger.security = [{
        bearerAuth: ['admin']
      }]
      #swagger.parameters['vatPercentage, shippingFee, thresholdFreeShipping'] = {
          in: 'body',
          description: '{vatPercentage, shippingFee, thresholdFreeShipping} info of Price Calculation Settings',
          required: 'true',
          type: 'object',
      }
      #swagger.responses[200] = {
          description: 'updated PriceCalcSettingsObj',
      }
      #swagger.responses[404] = {
          description: 'ObjectNotFoundError(PriceCalcSettings config record not found)'
      }
    */
    const priceCalcSettings: IPriceCalcSettingsDoc | null =
      await PriceCalcSettings.findOne();
    if (priceCalcSettings) {
      priceCalcSettings.vatPercentage =
        req.body.vatPercentage || priceCalcSettings.vatPercentage;
      priceCalcSettings.shippingFee =
        req.body.shippingFee || priceCalcSettings.shippingFee;
      priceCalcSettings.thresholdFreeShipping =
        req.body.thresholdFreeShipping ||
        priceCalcSettings.thresholdFreeShipping;
      const updatedPriceCalcSettings = await priceCalcSettings.save();
      res.send(updatedPriceCalcSettings.toJSON());
    } else {
      throw new ObjectNotFoundError(
        'PriceCalcSettings config record not found'
      );
    }
  }
);

export { router as updatePriceCalcSettingsRouter };
