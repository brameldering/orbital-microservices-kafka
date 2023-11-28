import { CURRENCY_SYMBOL } from 'constants/constants-frontend';

import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  HOME_PAGE_URL,
  NO_RESULTS_MESSAGE,
  // ORDER_ID_1,
  // ORDER_ID_2,
  PRODUCT_1,
  PRODUCT_2,
  SHIPPING_FEE,
  REQUIRED,
  SEARCH_KEYWORD,
  SEARCH_KEYWORD_NO_RESULTS,
  SUBTOTAL_1_ITEMS,
  SUBTOTAL_2_ITEMS,
  SUBTOTAL_3_ITEMS,
  TEST_STREET,
  TEST_POSTALCODE,
  TEST_CITY,
  TEST_COUNTRY,
  TEST_ADDRESS_LINE,
  // TEST_USER_NAME,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
  YOUR_CART_IS_EMPTY,
} from '../test_constants';
import {
  H1_SHOPPING_CART,
  H1_SHIPPING,
  H1_MY_ORDERS,
  H1_ORDER_ADMIN,
  H1_PRODUCTS,
  H1_SIGN_IN,
  H1_PAYMENT_METHOD,
  // H2_ORDER_DETAILS,
} from 'constants/form-titles';

describe('Initialize', () => {
  it('Clears cookies and localStorage', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
  it('Seeds test database', () => {
    cy.exec('npm run seeddata');
  });
});

describe('Shopping tests', () => {
  beforeEach(() => cy.visit(HOME_PAGE_URL));
  it('E2E_SHOP_OM_1: Search for products and test back and home links', () => {
    // Check that we are on Products page and all 6 products are shown
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('[id="product_card"]').should('have.length', 6);
    // search for phone and check that 2 products match
    cy.get('[id="search_keyword"]').type(SEARCH_KEYWORD);
    cy.get('[id="LINK_header_search"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('[id="product_card"]').should('have.length', 2);
    // Go back to main page using [go back] and check that now all 6 products appear
    cy.get('[id="BUTTON_back"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('[id="product_card"]').should('have.length', 6);
    // Search for keyword that should give 0 results
    cy.get('[id="search_keyword"]').type(SEARCH_KEYWORD_NO_RESULTS);
    cy.get('[id="LINK_header_search"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('[id="product_card"]').should('have.length', 0);
    cy.contains(NO_RESULTS_MESSAGE);
    // Go back to main page by clicking brand logo and check there are 6 products
    cy.get('[id="LINK_orbitelco_shop"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('[id="product_card"]').should('have.length', 6);
  });
  it('E2E_SHOP_OM_2: Select one product, change to 2 items and empty cart', () => {
    // Check that we are on Products page and all 6 products are shown
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('[id="product_card"]').should('have.length', 6);
    // Select mousde product and check we go to product page
    cy.contains(PRODUCT_1.name).click();
    cy.get('h3').invoke('text').should('equal', PRODUCT_1.name);
    // select 2 items and add to cart
    cy.get('[id="select_quantity"]').select('2');
    cy.get('[id="BUTTON_add_to_cart"]').click();
    cy.get('h1').invoke('text').should('equal', H1_SHOPPING_CART);
    cy.get('h2').invoke('text').should('equal', SUBTOTAL_2_ITEMS);
    // Check that clicking the product name takes us to the product page
    let queryId: string = `[id="product_name_` + PRODUCT_1.name + `"]`;
    cy.get(queryId).click();
    cy.get('h3').invoke('text').should('equal', PRODUCT_1.name);
    // Check that [go back] takes us back to the cart again
    cy.get('[id="BUTTON_go_back"]').click();
    cy.get('h1').invoke('text').should('equal', H1_SHOPPING_CART);
    cy.get('h2').invoke('text').should('equal', SUBTOTAL_2_ITEMS);
    // Remove item from cart
    queryId = `[id="remove_from_cart_` + PRODUCT_1.name + `"]`;
    cy.get(queryId).click();
    cy.contains(YOUR_CART_IS_EMPTY);
    cy.get('[id="LINK_go_to_shop"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
  });
  it('E2E_SHOP_OM_3: Full order flow of 1 product with shipping fee', () => {
    // Check that we are on Products page and all 6 products are shown
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('[id="product_card"]').should('have.length', 6);
    // Select Mouse Product
    cy.contains(PRODUCT_1.name).click();
    cy.get('h3').invoke('text').should('equal', PRODUCT_1.name);
    // Add to cart
    cy.get('[id="BUTTON_add_to_cart"]').click();
    cy.get('h1').invoke('text').should('equal', H1_SHOPPING_CART);
    cy.get('h2').invoke('text').should('equal', SUBTOTAL_1_ITEMS);
    // Check out
    cy.get('[id="BUTTON_checkout"]').click();
    // Sign in
    cy.get('h1').invoke('text').should('equal', H1_SIGN_IN);
    cy.get('[id="email"]').type(TEST_USER_EMAIL);
    cy.get('[id="password"]').type(TEST_USER_PASSWORD);
    cy.get('[id="BUTTON_login"]').click();
    cy.get('h1').invoke('text').should('equal', H1_SHIPPING);
    // Click continue so that that error messages appear for required fields
    cy.get('[id="BUTTON_continue"]').click();
    cy.get('[id="error_text_address"]')
      .invoke('text')
      .should('equal', REQUIRED);
    cy.get('[id="error_text_postalCode"]')
      .invoke('text')
      .should('equal', REQUIRED);
    cy.get('[id="error_text_city"]').invoke('text').should('equal', REQUIRED);
    cy.get('[id="error_text_country"]')
      .invoke('text')
      .should('equal', REQUIRED);
    // Fill in address fields and check that error messages have dissapeared
    cy.get('[id="address"]').type(TEST_STREET);
    cy.get('[id="postalCode"]').type(TEST_POSTALCODE);
    cy.get('[id="city"]').type(TEST_CITY);
    cy.get('[id="country"]').type(TEST_COUNTRY);
    // cy.get('[id="error_text_address"]').should('not.exist');
    // cy.get('[id="error_text_postalCode"]').should('not.exist');
    // cy.get('[id="error_text_city"]').should('not.exist');
    // cy.get('[id="error_text_country"]').should('not.exist');
    // Click continue button and check we are on Payment Method page
    cy.get('[id="BUTTON_continue"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PAYMENT_METHOD);
    // Click continue button and check items on Order Summary page
    cy.get('[id="BUTTON_continue"]').click();
    cy.contains('Shipping');
    cy.contains('Address: ' + TEST_ADDRESS_LINE);
    cy.contains('Payment Method');
    cy.contains('Method: PayPal');
    cy.contains('Order Items');
    cy.contains('1 x €50.00 = €50.00');
    // cy.contains(H2_ORDER_DETAILS);
    cy.contains(CURRENCY_SYMBOL + PRODUCT_1.price.toFixed(2));
    cy.contains(CURRENCY_SYMBOL + SHIPPING_FEE.toFixed(2));
    cy.contains(CURRENCY_SYMBOL + PRODUCT_1.vat.toFixed(2));
    cy.contains(CURRENCY_SYMBOL + '65.00'); // Total
    // Click [place order] and check we are on order screen
    cy.get('[id="BUTTON_place_order"]').click();
    // cy.contains('Order Details');
    // cy.contains('Order Id: ' + ORDER_ID_1);
    cy.contains('Shipping');
    // cy.contains('Email: john@email.com');
    // cy.contains('Name: John Doe');
    cy.contains('Address: ' + TEST_ADDRESS_LINE);
    cy.contains('Not Delivered');
    cy.contains('Payment Method');
    cy.contains('Method: PayPal');
    cy.contains('Not Paid');
    cy.contains('Order Items');
    cy.contains('1 x €50.00 = €50.00');
    // cy.contains(H2_ORDER_DETAILS);
    cy.contains(CURRENCY_SYMBOL + PRODUCT_1.price.toFixed(2));
    cy.contains(CURRENCY_SYMBOL + SHIPPING_FEE.toFixed(2));
    cy.contains(CURRENCY_SYMBOL + PRODUCT_1.vat.toFixed(2));
    cy.contains(CURRENCY_SYMBOL + '65.00'); // Total
  });
  it('E2E_SHOP_OM_4: Full order flow of 2 products with 3 items in total', () => {
    // Check that we are on Products page and all 6 products are shown
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('[id="product_card"]').should('have.length', 6);
    // Select Mouse Product
    cy.contains(PRODUCT_1.name).click();
    cy.get('h3').invoke('text').should('equal', PRODUCT_1.name);
    // Add to cart
    cy.get('[id="BUTTON_add_to_cart"]').click();
    cy.get('h1').invoke('text').should('equal', H1_SHOPPING_CART);
    cy.get('h2').invoke('text').should('equal', SUBTOTAL_1_ITEMS);
    // Back to home page and select playstation
    cy.get('[id="LINK_orbitelco_shop"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.contains(PRODUCT_2.name).click();
    cy.get('h3').invoke('text').should('equal', PRODUCT_2.name);
    // Add to cart
    cy.get('[id="BUTTON_add_to_cart"]').click();
    cy.get('h1').invoke('text').should('equal', H1_SHOPPING_CART);
    cy.get('h2').invoke('text').should('equal', SUBTOTAL_2_ITEMS);
    cy.get('[id="product_item"]').should('have.length', 2);
    cy.contains(CURRENCY_SYMBOL + '450.00');
    const queryId: string = `[id="select_quantity_` + PRODUCT_2.name + `"]`;
    cy.get(queryId).select('2');
    // Check out
    cy.get('[id="BUTTON_checkout"]').click();
    // Sign in
    cy.get('h1').invoke('text').should('equal', H1_SIGN_IN);
    cy.get('[id="email"]').type(TEST_USER_EMAIL);
    cy.get('[id="password"]').type(TEST_USER_PASSWORD);
    cy.get('[id="BUTTON_login"]').click();
    cy.get('h1').invoke('text').should('equal', H1_SHIPPING);
    // Click cart button to go back to cart
    cy.get('[id="LINK_header_cart"]').click();
    cy.get('h1').invoke('text').should('equal', H1_SHOPPING_CART);
    cy.get('h2').invoke('text').should('equal', SUBTOTAL_3_ITEMS);
    cy.get('[id="product_item"]').should('have.length', 2);
    cy.contains('€850.00');
    // Check out
    cy.get('[id="BUTTON_checkout"]').click();
    cy.get('h1').invoke('text').should('equal', H1_SHIPPING);
    // Fill in address fields
    cy.get('[id="address"]').type(TEST_STREET);
    cy.get('[id="postalCode"]').type(TEST_POSTALCODE);
    cy.get('[id="city"]').type(TEST_CITY);
    cy.get('[id="country"]').type(TEST_COUNTRY);
    // Click continue button and check we are on Payment Method page
    cy.get('[id="BUTTON_continue"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PAYMENT_METHOD);
    // Click continue button and check items on Order Summary page
    cy.get('[id="BUTTON_continue"]').click();
    cy.contains('Shipping');
    cy.contains('Address: ' + TEST_ADDRESS_LINE);
    cy.contains('Payment Method');
    cy.contains('Method: PayPal');
    cy.contains('Order Items');
    cy.contains('1 x €50.00 = €50.00');
    cy.contains('2 x €400.00 = €800.00');
    // cy.contains(H2_ORDER_DETAILS);
    cy.contains(CURRENCY_SYMBOL + '850.00');
    cy.contains(CURRENCY_SYMBOL + '0.00');
    cy.contains(CURRENCY_SYMBOL + '178.50');
    cy.contains(CURRENCY_SYMBOL + '1028.50');
    // Click [place order] and check we are on order screen
    cy.get('[id="BUTTON_place_order"]').click();
    // cy.contains('Order Details');
    // cy.contains('Order Id: ' + ORDER_ID_2);
    cy.contains('Shipping');
    // cy.contains('Email: john@email.com');
    // cy.contains('Name: John Doe');
    cy.contains('Address: ' + TEST_ADDRESS_LINE);
    cy.contains('Not Delivered');
    cy.contains('Payment Method');
    cy.contains('Method: PayPal');
    cy.contains('Not Paid');
    cy.contains('Order Items');
    cy.contains('1 x €50.00 = €50.00');
    cy.contains('2 x €400.00 = €800.00');
    // cy.contains(H2_ORDER_DETAILS);
    cy.contains(CURRENCY_SYMBOL + '850.00');
    cy.contains(CURRENCY_SYMBOL + '0.00');
    cy.contains(CURRENCY_SYMBOL + '178.50');
    cy.contains(CURRENCY_SYMBOL + '1028.50');
    // Check My Orders now contains 2 orders
    cy.get('[id="LINK_header_username"]').click();
    cy.get('[id="LINK_my_orders"]').click();
    cy.get('h1').invoke('text').should('equal', H1_MY_ORDERS);
    // Check there are no errors
    cy.get('alert_error').should('not.exist');
    cy.get('error_message').should('not.exist');
    cy.get('tr').should('have.length', 3);
    // cy.contains(ORDER_ID_1);
    // cy.contains(ORDER_ID_2);
    cy.contains(CURRENCY_SYMBOL + '65.00');
    cy.contains(CURRENCY_SYMBOL + '1028.50');
  });
});
describe('Test Reviews', () => {
  beforeEach(() => cy.visit(HOME_PAGE_URL));
  it('E2E_SHOP_OM_5: Write succesful review', () => {
    // Check that we are on Products page and all 6 products are shown
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('[id="product_card"]').should('have.length', 6);
    // Select Mouse Product and check review block
    cy.contains(PRODUCT_1.name).click();
    cy.get('h3').invoke('text').should('equal', PRODUCT_1.name);
    cy.contains('Please sign in to write a review');
    cy.get('[id="LINK_sign_in"]').click();
    // Sign in
    cy.get('h1').invoke('text').should('equal', H1_SIGN_IN);
    cy.get('[id="email"]').type(TEST_USER_EMAIL);
    cy.get('[id="password"]').type(TEST_USER_PASSWORD);
    cy.get('[id="BUTTON_login"]').click();
    // cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.wait(1000);
    cy.contains(PRODUCT_1.name).click();
    cy.get('h3').invoke('text').should('equal', PRODUCT_1.name);
    cy.contains('No Reviews');
    cy.get('[id="rating"]').select('5 - Excellent');
    cy.get('[id="comment"]').type('Test comment');
    cy.get('[id="BUTTON_review_submit"]').click();
    cy.contains('John Doe');
    cy.contains('Test comment');
  });
  it('E2E_SHOP_OM_6: Write another review which should give error message', () => {
    // Check that we are on Products page and all 6 products are shown
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('[id="product_card"]').should('have.length', 6);
    // Sign in using sign in link
    cy.get('[id="LINK_header_sign_in"]').click();
    cy.get('h1').invoke('text').should('equal', H1_SIGN_IN);
    cy.get('[id="email"]').type(TEST_USER_EMAIL);
    cy.get('[id="password"]').type(TEST_USER_PASSWORD);
    cy.get('[id="BUTTON_login"]').click();
    // Try to do another review and check that message appears
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.contains(PRODUCT_1.name).click();
    cy.get('h3').invoke('text').should('equal', PRODUCT_1.name);
    // Select product which has already been reviewed by test user
    cy.get('[id="rating"]').select('3 - Good');
    cy.get('[id="comment"]').type('Another test comment');
    cy.get('[id="BUTTON_review_submit"]').click();
    cy.get('[id="alert_error"]')
      .invoke('text')
      .should('equal', 'You have already reviewed this product');
  });
});
describe('Test Order Admin', () => {
  beforeEach(() => cy.visit(HOME_PAGE_URL));
  it('E2E_SHOP_OM_7: There are 2 orders in Order Admin screen', () => {
    // Sign in using sign in link
    cy.get('[id="LINK_header_sign_in"]').click();
    cy.get('h1').invoke('text').should('equal', H1_SIGN_IN);
    cy.get('[id="email"]').type(ADMIN_EMAIL);
    cy.get('[id="password"]').type(ADMIN_PASSWORD);
    cy.get('[id="BUTTON_login"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('[id="LINK_header_adminmenu"]').click();
    cy.get('[id="LINK_header_orders"]').click();
    cy.get('h1').invoke('text').should('equal', H1_ORDER_ADMIN);
    // Check there are no errors
    cy.get('alert_error').should('not.exist');
    cy.get('error_message').should('not.exist');
    // Check there are 3 rows (1 header and 2 order records)
    cy.get('tr').should('have.length', 3);
    // cy.contains(ORDER_ID_1);
    // cy.contains(ORDER_ID_2);
    // Test name John Doe appears twice
    // cy.get('body')
    //   .invoke('text')
    //   .then((text) => {
    //     const count = (text.match(new RegExp(TEST_USER_NAME, 'g')) || [])
    //       .length;
    //     // Assert the count
    //     cy.log(`Number of occurrences of "${TEST_USER_NAME}": ${count}`);
    //     cy.wrap(count).should('be.equal', 2); // Change 2 to your expected count
    //   });
    // Test existence of order amounts
    cy.contains(CURRENCY_SYMBOL + '65.00');
    cy.contains(CURRENCY_SYMBOL + '1028.50');
  });
});
