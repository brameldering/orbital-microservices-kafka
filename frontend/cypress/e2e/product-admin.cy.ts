import {
  HOME_PAGE_URL,
  LOGIN_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  H1_EDIT_PRODUCT,
  H1_SIGN_IN,
  H1_PRODUCTS,
  ARE_YOU_SURE_YOU_WANT_TO_CREATE_A_NEW_PRODUCT,
  PRODUCT_7_SEQ_ID,
  SAMPLE_PRODUCT_NAME,
  SAMPLE_PRODUCT_BRAND,
  SAMPLE_PRODUCT_CATEGORY,
  NEW_PRODUCT_NAME,
  NEW_PRODUCT_BRAND,
  NEW_PRODUCT_CATEGORY,
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_PRODUCT,
} from '../test_constants';

describe('Initialize', () => {
  it('Clears cookies and localStorage', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
  it('Seeds test database', () => {
    cy.exec('cd .. && cd backend && npm run data:import');
  });
});

describe('Create new product, update product and delete product', () => {
  it('Opens Sign In page', () => {
    cy.visit(LOGIN_URL);
    cy.get('h1').invoke('text').should('equal', H1_SIGN_IN);
    cy.get('[id="email"]').type(ADMIN_EMAIL);
    cy.get('[id="password"]').type(ADMIN_PASSWORD);
    cy.get('[id="BUTTON_login"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    // });
    // it('Opens Product Admin page', () => {
    cy.get('[id="LINK_header_adminmenu"]').click();
    cy.get('[id="LINK_header_products"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('tr').should('have.length', 7); // 6 products and header
    // Check there are no errors
    cy.get('alert_error').should('not.exist');
    cy.get('error_message').should('not.exist');
    // Create new product
    // });
    // it('Create new product', () => {
    cy.get('[id="BUTTON_create_product"]').click();
    cy.contains(ARE_YOU_SURE_YOU_WANT_TO_CREATE_A_NEW_PRODUCT);
    cy.get('[id="BUTTON_yes"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.contains(SAMPLE_PRODUCT_NAME);
    cy.contains(SAMPLE_PRODUCT_CATEGORY);
    cy.contains(SAMPLE_PRODUCT_BRAND);
    cy.get('tr').should('have.length', 8); // 7 products and header
    // });
    // it('Edit new product', () => {
    // Select product to administrate
    let queryId: string = `[id="edit_` + PRODUCT_7_SEQ_ID + `"]`;
    cy.get(queryId).click();
    cy.get('h1').invoke('text').should('equal', H1_EDIT_PRODUCT);
    cy.contains('Product Id: ' + PRODUCT_7_SEQ_ID);
    // Change product info
    // Note that updating the image is not checked
    cy.get('[id="name"]').clear().type(NEW_PRODUCT_NAME);
    cy.get('[id="brand"]').clear().type(NEW_PRODUCT_BRAND);
    cy.get('[id="category"]').clear().type(NEW_PRODUCT_CATEGORY);
    cy.get('[id="BUTTON_save"]').click();
    // Check updated product info is shown in products list
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    cy.get('tr').should('have.length', 8); // 7 products and header
    queryId = `[id="name_` + PRODUCT_7_SEQ_ID + `"]`;
    cy.get(queryId).invoke('text').should('equal', NEW_PRODUCT_NAME);
    queryId = `[id="brand_` + PRODUCT_7_SEQ_ID + `"]`;
    cy.get(queryId).invoke('text').should('equal', NEW_PRODUCT_BRAND);
    queryId = `[id="category_` + PRODUCT_7_SEQ_ID + `"]`;
    cy.get(queryId).invoke('text').should('equal', NEW_PRODUCT_CATEGORY);
    // Test deleting a product
    // });
    // it('Delete new product', () => {
    queryId = `[id="delete_` + PRODUCT_7_SEQ_ID + `"]`;
    cy.get(queryId).click();
    cy.contains(ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_PRODUCT);
    cy.get('[id="BUTTON_yes"]').click();
    cy.get('h1').invoke('text').should('equal', H1_PRODUCTS);
    // Check there are no errors
    cy.get('alert_error').should('not.exist');
    cy.get('error_message').should('not.exist');
    cy.get('tr').should('have.length', 7); // 6 products and header
    queryId = `[id="name_` + PRODUCT_7_SEQ_ID + `"]`;
    cy.get(queryId).should('not.exist');
  });
});
