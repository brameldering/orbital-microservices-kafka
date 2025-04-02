import { IPriceCalcSettingsAttrs , IPriceCalcSettingsDoc}
  from '../types/mongoose-model-types/mongoose-price-calc-settings-types';
import { PriceCalcSettings } from '../models/price-calc-settings-model';

export const getPriceCalcSettings =
  async (): Promise<IPriceCalcSettingsAttrs | null> => {
    const priceCalcSettings: IPriceCalcSettingsDoc | null =
      await PriceCalcSettings.findOne();
    if (priceCalcSettings) {
      return priceCalcSettings.toJSON();
    } else {
      return null;
    }
  };
