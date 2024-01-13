const TEST_CONSTANTS = {
  HOME_PAGE_URL: 'https://orbital.dev/product',
  LOGIN_URL: 'https://orbital.dev/auth/signin',

  TEST_USER_NAME: 'John Doe',
  TEST_USER_EMAIL: 'john@email.com',
  TEST_USER_PASSWORD: '123456',
  NEW_USER_NAME: 'User Name',
  NEW_USER_EMAIL: 'test.user@email.com',
  NEW_USER_PASSWORD: 'StandardP@ssw0rd',
  UNKNOWN_EMAIL: 'unknown.user@email.com',
  WRONG_PASSWORD: 'Wr0ngP@ssw0rd',
  UPDATED_USER_NAME: 'Updated User Name',
  UPDATED_EMAIL: 'updated.name@email.com',
  UPDATED_PASSWORD: 'NewP@ssw0rd',
  RESET_PASSWORD: '123456',
  ADMIN_EMAIL: 'admin@email.com',
  ADMIN_PASSWORD: '123456',

  // Color of admin status
  COLOR_GREEN: 'rgb(0, 128, 0)',

  // Messages
  THAT_EMAIL_ALREADY_EXISTS: 'That email already exists',
  INVALID_EMAIL_OR_PASSWORD: 'Not authorized',
  INVALID_EMAIL_ADDRESS: 'Invalid email address',
  REQUIRED: 'Required',
  USER_NOT_FOUND: 'User not found',

  YOU_HAVE_NO_ORDERS: 'You have no orders',
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_USER:
    'Are you sure you want to delete this user?',

  SEARCH_KEYWORD: 'phone',
  SEARCH_KEYWORD_NO_RESULTS: 'no results',
  NO_RESULTS_MESSAGE: 'No products match the search keyword',
  PRODUCT_1: {
    name: 'Logitech G-Series Gaming Mouse',
    price: 50,
    vat: 50 * 0.21,
  },
  PRODUCT_2: {
    name: 'Sony Playstation 5',
    price: 400,
    vat: 400 * 0.21,
  },
  SHIPPING_FEE: 4.5,
  SUBTOTAL_1_ITEMS: 'Subtotal (1) items',
  SUBTOTAL_2_ITEMS: 'Subtotal (2) items',
  SUBTOTAL_3_ITEMS: 'Subtotal (3) items',
  YOUR_CART_IS_EMPTY: 'Your cart is empty',

  TEST_STREET: 'Teststreet 100-1',
  TEST_POSTALCODE: '1000 AA',
  TEST_CITY: 'Test City',
  TEST_COUNTRY: 'Test Country',
  TEST_ADDRESS_LINE: 'Teststreet 100-1, 1000 AA Test City, Test Country',

  ORDER_ID_1: 'ORD-0000000001',
  ORDER_ID_2: 'ORD-0000000002',

  // Product Management
  ARE_YOU_SURE_YOU_WANT_TO_CREATE_A_NEW_PRODUCT:
    'Are you sure you want to create a new product?',
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_PRODUCT:
    'Are you sure you want to delete this product?',
  YOU_HAVE_ALREADY_REVIEWED_THIS_PRODUCT:
    'You have already reviewed this product',

  PRODUCT_7_SEQ_ID: 'PRD-0000000007',
  SAMPLE_PRODUCT_NAME: 'Sample name',
  SAMPLE_PRODUCT_CATEGORY: 'Sample category',
  SAMPLE_PRODUCT_BRAND: 'Sample brand',
  NEW_PRODUCT_NAME: 'New product name',
  NEW_PRODUCT_CATEGORY: 'New product category',
  NEW_PRODUCT_BRAND: 'New product brand',
};

export default TEST_CONSTANTS;
