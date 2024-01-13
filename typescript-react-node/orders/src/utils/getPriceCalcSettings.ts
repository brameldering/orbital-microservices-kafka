import {
  PriceCalcSettings,
  IPriceCalcSettingsAttrs,
  IPriceCalcSettingsDoc,
} from '@orbital_app/common';

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
