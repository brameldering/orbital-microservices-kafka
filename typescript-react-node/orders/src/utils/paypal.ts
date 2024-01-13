// import dotenv from 'dotenv';
// import { Order } from '../orderModel';
import { IOrderModel, ExternalAPIError } from '@orbital_app/common';

// dotenv.config();
const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;

/**
 * Fetches an access token from the PayPal API.
 * @see {@link https://developer.paypal.com/reference/get-an-access-token/#link-getanaccesstoken}
 *
 * @returns {Promise<string>} The access token if the request is successful.
 * @throws {ExternalAPIError} If the request is not successful.
 *
 */
async function getPayPalAccessToken() {
  // Authorization header requires base64 encoding
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_APP_SECRET).toString(
    'base64'
  );

  const url = `${PAYPAL_API_URL}/v1/oauth2/token`;

  const headers = {
    Accept: 'application/json',
    'Accept-Language': 'en_US',
    Authorization: `Basic ${auth}`,
  };

  const body = 'grant_type=client_credentials';
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) throw new ExternalAPIError('Failed to get access token');

  const payPalData = await response.json();

  return payPalData.access_token;
}

/**
 * Verifies a PayPal payment by making a request to the PayPal API.
 * @see {@link https://developer.paypal.com/docs/api/orders/v2/#orders_get}
 *
 * @param {string} payPalTransactionId - The PayPal transaction ID to be verified.
 * @returns {Promise<Object>} An object with properties 'verified' indicating if the payment is completed and 'value' indicating the payment amount.
 * @throws {ExternalAPIError} If the request is not successful.
 *
 */
export async function verifyPayPalPayment(payPalTransactionId: string) {
  const accessToken = await getPayPalAccessToken();
  const payPalResponse = await fetch(
    `${PAYPAL_API_URL}/v2/checkout/orders/${payPalTransactionId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!payPalResponse.ok)
    throw new ExternalAPIError('Failed to verify payment');

  const payPalData = await payPalResponse.json();
  return {
    verified: payPalData.status === 'COMPLETED',
    value: payPalData.purchase_units[0].amount.value,
  };
}

/**
 * Checks if a PayPal transaction is new by comparing the transaction ID with existing orders in the database.
 *
 * @param {Mongoose.Model} IOrderModel - The Mongoose model for the orders in the database.
 * @param {string} payPalTransactionId - The PayPal transaction ID to be checked.
 * @returns {Promise<boolean>} Returns true if it is a new transaction (i.e., the transaction ID does not exist in the database), false otherwise.
 * @throws {ExternalAPIError} If there's an error in querying the database.
 *
 */
export async function checkIfNewTransaction(
  orderModel: IOrderModel,
  payPalTransactionId: string
) {
  try {
    // Find all documents where Order.paymentResult.id is the same as the id passed payPalTransactionId
    const orders = await orderModel.find({
      'paymentResult.id': payPalTransactionId,
    });

    // If there are no such orders, then it's a new transaction.
    return orders.length === 0;
  } catch (err: any) {
    throw new ExternalAPIError(err.message);
  }
}
