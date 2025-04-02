// config
// TO MOVE TO OWN MICROSERVICE: orders -> config
export const GET_PAYPAL_CLIENT_ID_URL: string = '/api/orders/v2/paypalclientid';

// Orders
export const ORDERS_URL = '/api/orders/v2';
export const MY_ORDERS_URL = ORDERS_URL + '/mine';
export const UPDATE_ORDER_TO_PAID_URL = ORDERS_URL + '/updatetopaid';
export const UPDATE_ORDER_TO_DELIVERED_URL = ORDERS_URL + '/updatetodelivered';
export const PRICE_CALC_SETTINGS_URL = ORDERS_URL + '/pricecalcsettings';
