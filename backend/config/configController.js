import asyncHandler from '../middleware/asyncHandler.js';

// @desc    Get VAT Percentage and Shipping Fee from .env
// @route   GET /api/config/v1/vatshippingfee
// @access  Public
// @req
// @res     status(200).json({ VATPercentage, ShippingFee })
const getVATandShippingFee = asyncHandler(async (req, res) => {
  res.status(200).json({
    VATPercentage: process.env.VAT_PERCENTAGE,
    ShippingFee: process.env.SHIPPING_FEE,
  });
});

// @desc    Get PayPal client id from .env
// @route   GET /api/config/v1/paypalclientid
// @access  Public
// @req
// @res     status(200).json({ clientId })
const getPayPalClientId = asyncHandler(async (req, res) => {
  res.status(200).json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

export { getVATandShippingFee, getPayPalClientId };
