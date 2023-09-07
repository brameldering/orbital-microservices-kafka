export const BASE_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';
// export const BASE_URL = ''; // Because we are using a proxy defined in package.json
export const PRODUCTS_URL = '/api/products/v1';
export const USERS_URL = '/api/users/v1';
export const ORDERS_URL = '/api/orders/v1';
export const PAYPAL_URL = '/api/config/v1/paypal';
export const UPLOAD_URL = `/api/upload/v1/`;

export const CURRENCY_SYMBOL = '€';
export const CURRENCY_PAYPAL = 'EUR';
