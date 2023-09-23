import asyncHandler from '../general/middleware/asyncHandler.js';

// @desc    Get PayPal client id from .env
// @route   GET /api/config/v1/paypalclientid
// @access  Public
// @req
// @res     status(200).json({ clientId })
const getPayPalClientId = asyncHandler(async (req, res) => {
  res.status(200).json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// // API to provide the PAYPAL_CLIENT_ID from .env to frontend
// app.get('/api/config/v1/paypal', (req, res) =>
//   res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
// );

export { getPayPalClientId };
