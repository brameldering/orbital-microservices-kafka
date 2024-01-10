import TEST_CONSTANTS from '../test_constants';
import TITLES from 'constants/form-titles';

const loginAsAdminAndGoToProductAdmin = () => {
  cy.visit(TEST_CONSTANTS.LOGIN_URL);
  cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SIGN_IN);
  cy.get('[id="email"]').type(TEST_CONSTANTS.ADMIN_EMAIL);
  cy.get('[id="password"]').type(TEST_CONSTANTS.ADMIN_PASSWORD);
  cy.get('[id="BUTTON_login"]').click();
  cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SHOP);
  cy.get('[id="LINK_header_adminmenu"]').click();
  cy.get('[id="LINK_header_products"]').click();
  cy.get('h1').invoke('text').should('equal', TITLES.TITLE_PRODUCT_ADMIN);
};

describe('Initialize', () => {
  it('Clears cookies and localStorage', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
  it('Seeds test database', () => {
    cy.exec('npm run seeddata');
  });
});

describe('Create new product, update product and delete product', () => {
  it('Opens Product Admin page', () => {
    loginAsAdminAndGoToProductAdmin();
    cy.get('tr').should('have.length', 7); // 6 products and header
    // Check there are no errors
    cy.get('[id="error_message"]').should('not.exist');
  });
  it('E2E_PM_1: Create new product', () => {
    loginAsAdminAndGoToProductAdmin();
    cy.get('[id="BUTTON_create_product"]').click();
    cy.contains(TEST_CONSTANTS.ARE_YOU_SURE_YOU_WANT_TO_CREATE_A_NEW_PRODUCT);
    cy.get('[id="BUTTON_yes"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_PRODUCT_ADMIN);
    cy.contains(TEST_CONSTANTS.SAMPLE_PRODUCT_NAME);
    cy.contains(TEST_CONSTANTS.SAMPLE_PRODUCT_CATEGORY);
    cy.contains(TEST_CONSTANTS.SAMPLE_PRODUCT_BRAND);
    cy.get('tr').should('have.length', 8); // 7 products and header
  });
  it('E2E_PM_2: Edit product', () => {
    loginAsAdminAndGoToProductAdmin();
    // Select product to administrate
    let queryId: string = `[id="edit_` + TEST_CONSTANTS.PRODUCT_7_SEQ_ID + `"]`;
    cy.get(queryId).click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_EDIT_PRODUCT);
    cy.contains('Product Id: ' + TEST_CONSTANTS.PRODUCT_7_SEQ_ID);
    // Change product info
    // Note that updating the image is not checked
    cy.get('[id="name"]').clear().type(TEST_CONSTANTS.NEW_PRODUCT_NAME);
    cy.get('[id="brand"]').clear().type(TEST_CONSTANTS.NEW_PRODUCT_BRAND);
    cy.get('[id="category"]').clear().type(TEST_CONSTANTS.NEW_PRODUCT_CATEGORY);
    cy.get('[id="BUTTON_save"]').click();
    // Check updated product info is shown in products list
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_PRODUCT_ADMIN);
    cy.get('tr').should('have.length', 8); // 7 products and header
    queryId = `[id="name_` + TEST_CONSTANTS.PRODUCT_7_SEQ_ID + `"]`;
    cy.get(queryId)
      .invoke('text')
      .should('equal', TEST_CONSTANTS.NEW_PRODUCT_NAME);
    queryId = `[id="brand_` + TEST_CONSTANTS.PRODUCT_7_SEQ_ID + `"]`;
    cy.get(queryId)
      .invoke('text')
      .should('equal', TEST_CONSTANTS.NEW_PRODUCT_BRAND);
    queryId = `[id="category_` + TEST_CONSTANTS.PRODUCT_7_SEQ_ID + `"]`;
    cy.get(queryId)
      .invoke('text')
      .should('equal', TEST_CONSTANTS.NEW_PRODUCT_CATEGORY);
  });
  it('E2E_PM_3: Delete new product', () => {
    loginAsAdminAndGoToProductAdmin();
    // Test deleting a product
    let queryId = `[id="delete_` + TEST_CONSTANTS.PRODUCT_7_SEQ_ID + `"]`;
    cy.get(queryId).click();
    cy.contains(TEST_CONSTANTS.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_PRODUCT);
    cy.get('[id="BUTTON_yes"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_PRODUCT_ADMIN);
    // Check there are no errors
    cy.get('[id="error_message"]').should('not.exist');
    cy.get('tr').should('have.length', 7); // 6 products and header
    queryId = `[id="name_` + TEST_CONSTANTS.PRODUCT_7_SEQ_ID + `"]`;
    cy.get(queryId).should('not.exist');
  });
});
