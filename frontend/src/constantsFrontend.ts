export const BASE_URL: string =
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';
// export const BASE_URL = ''; // Because we are using a proxy defined in package.json
export const PRODUCTS_URL: string = '/api/products/v1';
export const USERS_URL: string = '/api/users/v1';
export const ORDERS_URL: string = '/api/orders/v1';
export const GET_VAT_AND_SHIPPING_FEE_URL: string =
  '/api/config/v1/vatshippingfee';
export const GET_PAYPAL_CLIENT_ID_URL: string = '/api/config/v1/paypalclientid';
export const UPLOAD_URL: string = `/api/upload/v1/`;

export const CURRENCY_SYMBOL: string = '€';
export const CURRENCY_PAYPAL: string = 'EUR';
