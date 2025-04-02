// config
// TO MOVE TO OWN MICROSERVICE: orders -> config
export const GET_PAYPAL_CLIENT_ID_URL: string = '/api/orders/v2/paypalclientid';

// Auth / Users
export const USERS_URL = '/api/users/v2';
export const SIGN_UP_URL = USERS_URL + '/signup';
export const SIGN_IN_URL = USERS_URL + '/signin';
export const SIGN_OUT_URL = USERS_URL + '/signout';
export const CURRENT_USER_URL = USERS_URL + '/currentuser';
export const RESET_PASSWORD_URL = USERS_URL + '/resetpassword';
export const UPDATE_PASSWORD_URL = USERS_URL + '/updatepassword';
export const UPDATE_PROFILE_URL = USERS_URL + '/profile';
export const ROLES_URL = USERS_URL + '/roles';
export const API_ACCESS_URL = USERS_URL + '/apiaccess';

// Products
export const PRODUCTS_URL = '/api/products/v2';
export const PRODUCT_REVIEW_URL = PRODUCTS_URL + '/reviews';
export const UPLOAD_URL = PRODUCTS_URL + '/upload';

// Orders
export const ORDERS_URL = '/api/orders/v2';
export const MY_ORDERS_URL = ORDERS_URL + '/mine';
export const UPDATE_ORDER_TO_PAID_URL = ORDERS_URL + '/updatetopaid';
export const UPDATE_ORDER_TO_DELIVERED_URL = ORDERS_URL + '/updatetodelivered';
export const PRICE_CALC_SETTINGS_URL = ORDERS_URL + '/pricecalcsettings';

// Inventory
export const PRODUCT_INVENTORY_URL = '/api/inventory/v2/products';
// export const INVENTORY_QUANTITY_URL = '/api/inventory/v2/quantity';
export const INVENTORY_SERIALS_URL = '/api/inventory/v2/serials';
