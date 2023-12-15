import express, { Request, Response } from 'express';
import {
  PRICE_CALC_SETTINGS_URL,
  IPriceCalcSettingsAttrs,
} from '@orbitelco/common';
import { getPriceCalcSettings } from '../utils/getPriceCalcSettings';

const router = express.Router();

// @desc    Get Price Calculation Settings
// @route   GET /api/orders/v2/pricecalcsettings
// @access  Public
// @req
// @res     json(IPriceCalcSettingsAttrs)
router.get(PRICE_CALC_SETTINGS_URL, async (req: Request, res: Response) => {
  /*  #swagger.tags = ['Orders']
      #swagger.description = 'Get Price Calculation Settings'
          #swagger.security = [{
        bearerAuth: ['public']
      }]
      #swagger.responses[200] = {
          description: 'json(IPriceCalcSettingsAttrs)',
      }
 */
  const calcPriceSettings: IPriceCalcSettingsAttrs | null =
    await getPriceCalcSettings();
  res.send(calcPriceSettings);
});

export { router as getPriceCalcSettingsRouter };
