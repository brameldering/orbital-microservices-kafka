import express from 'express';

import { getVATandShippingFee, getPayPalClientId } from './configController';

const router = express.Router();
router.route('/api/config/v1/vatshippingfee').get(getVATandShippingFee);
router.route('/api/config/v1/paypalclientid').get(getPayPalClientId);

export default router;
