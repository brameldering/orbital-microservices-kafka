import express from 'express';
import { getVATandShippingFee, getPayPalClientId } from './configController';

const router = express.Router();
router.route('/vatshippingfee').get(getVATandShippingFee);
router.route('/paypalclientid').get(getPayPalClientId);

export default router;
