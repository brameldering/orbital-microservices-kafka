import {
  PriceCalcSettings,
  IPriceCalcSettingsObj,
  IPriceCalcSettingsDoc,
} from '@orbitelco/common';

export const getPriceCalcSettings =
  async (): Promise<IPriceCalcSettingsObj | null> => {
    const priceCalcSettings: IPriceCalcSettingsDoc | null =
      await PriceCalcSettings.findOne();
    if (priceCalcSettings) {
      return priceCalcSettings.toJSON();
    } else {
      return null;
    }
  };
