import TEST_CONSTANTS from '../test_constants';
import TITLES from 'constants/form-titles';
import { CUSTOMER_DISPLAY, ADMIN_DISPLAY } from '@orbital_app/common';

const login = (email: string, password: string) => {
  cy.visit(TEST_CONSTANTS.LOGIN_URL);
  cy.get('[id="email"]').type(email);
  cy.get('[id="password"]').type(password);
  cy.get('[id="BUTTON_login"]').click();
};

const loginAsAdminAndGoToUserAdmin = () => {
  login(TEST_CONSTANTS.ADMIN_EMAIL, TEST_CONSTANTS.ADMIN_PASSWORD);
  cy.get('[id="LINK_header_adminmenu"]').click();
  cy.get('[id="LINK_header_users"]').click();
  cy.get('h1').invoke('text').should('equal', TITLES.TITLE_USER_ADMIN);
  // Check there are no errors
  cy.get('[id="error_message"]').should('not.exist');
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

describe('Test registration of new account', () => {
  it('E2E_User_1: Opens register screen and enters new account', () => {
    cy.visit(TEST_CONSTANTS.LOGIN_URL);
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SIGN_IN);
    cy.get('[id="LINK_register_new_customer"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SIGN_UP);
    cy.get('[id="name"]').type(TEST_CONSTANTS.NEW_USER_NAME);
    cy.get('[id="email"]').type(TEST_CONSTANTS.NEW_USER_EMAIL);
    cy.get('[id="password"]').type(TEST_CONSTANTS.NEW_USER_PASSWORD);
    cy.get('[id="role"]').select(CUSTOMER_DISPLAY);
    cy.get('[id="BUTTON_register"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SHOP);
  });
  it('E2E_User_2: Opens register screen enters already existing account', () => {
    cy.visit(TEST_CONSTANTS.LOGIN_URL);
    cy.get('[id="LINK_register_new_customer"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SIGN_UP);
    cy.get('[id="name"]').type(TEST_CONSTANTS.NEW_USER_NAME);
    cy.get('[id="email"]').type(TEST_CONSTANTS.NEW_USER_EMAIL);
    cy.get('[id="password"]').type(TEST_CONSTANTS.NEW_USER_PASSWORD);
    cy.get('[id="role"]').select(CUSTOMER_DISPLAY);
    cy.get('[id="BUTTON_register"]').click();
    cy.contains(TEST_CONSTANTS.THAT_EMAIL_ALREADY_EXISTS);
  });
  it('E2E_User_3: Opens register screen and clicks Login (Already have an account)', () => {
    cy.visit(TEST_CONSTANTS.LOGIN_URL);
    cy.get('[id="LINK_register_new_customer"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SIGN_UP);
    cy.get('[id="LINK_already_have_an_account"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SIGN_IN);
  });
});
describe('Test logging in', () => {
  it('E2E_User_4: Signs in correctly with test account', () => {
    login(TEST_CONSTANTS.TEST_USER_EMAIL, TEST_CONSTANTS.TEST_USER_PASSWORD);
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SHOP);
  });
  it('E2E_User_5: Signs in with unknown account', () => {
    login(TEST_CONSTANTS.UNKNOWN_EMAIL, TEST_CONSTANTS.TEST_USER_PASSWORD);
    cy.contains(TEST_CONSTANTS.INVALID_EMAIL_OR_PASSWORD);
  });
  it('E2E_User_6: Signs in with incorrect password', () => {
    login(TEST_CONSTANTS.TEST_USER_EMAIL, TEST_CONSTANTS.WRONG_PASSWORD);
    cy.contains(TEST_CONSTANTS.INVALID_EMAIL_OR_PASSWORD);
  });
  it('E2E_User_7: Enters invalid email address and leaves password field empty', () => {
    cy.visit(TEST_CONSTANTS.LOGIN_URL);
    cy.get('[id="email"]').type('test');
    cy.get('[id="password"]').focus();
    cy.get('[id="error_text_email"]')
      .invoke('text')
      .should('equal', TEST_CONSTANTS.INVALID_EMAIL_ADDRESS);
    cy.get('[id="email"]').focus();
    cy.get('[id="error_text_password"]')
      .invoke('text')
      .should('equal', TEST_CONSTANTS.REQUIRED);
  });
});
describe('Test profile and password update', () => {
  it('E2E_User_8: Change username and email', () => {
    login(TEST_CONSTANTS.NEW_USER_EMAIL, TEST_CONSTANTS.NEW_USER_PASSWORD);
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SHOP);
    cy.get('[id="LINK_header_username"]').click();
    cy.get('[id="LINK_my_profile"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_MY_PROFILE);
    cy.get('[id="name"]').clear().type(TEST_CONSTANTS.UPDATED_USER_NAME);
    cy.get('[id="email"]').clear().type(TEST_CONSTANTS.UPDATED_EMAIL);
    cy.get('[id="BUTTON_update"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_MY_PROFILE);
    cy.wait(1000); // Wait one second to let MongoDB process the update
    // Check there are no errors
    cy.get('[id="error_message"]').should('not.exist');
  });
  it('E2E_User_9: Change password', () => {
    login(TEST_CONSTANTS.UPDATED_EMAIL, TEST_CONSTANTS.NEW_USER_PASSWORD);
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SHOP);
    cy.get('[id="LINK_header_username"]').click();
    cy.get('[id="LINK_my_profile"]').click();
    cy.get('[id="LINK_change_password"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_CHANGE_PASSWORD);
    cy.get('[id="currentPassword"]').type(TEST_CONSTANTS.NEW_USER_PASSWORD);
    cy.get('[id="newPassword"]').type(TEST_CONSTANTS.UPDATED_PASSWORD);
    cy.get('[id="BUTTON_update"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_MY_PROFILE);
    // Check there are no errors
    cy.get('[id="error_message"]').should('not.exist');
  });
  it('E2E_User_10: Login in with new email and password', () => {
    login(TEST_CONSTANTS.UPDATED_EMAIL, TEST_CONSTANTS.UPDATED_PASSWORD);
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SHOP);
  });
  it('E2E_User_11: Tries to reset password with unknown email address', () => {
    cy.visit(TEST_CONSTANTS.LOGIN_URL);
    cy.get('[id="LINK_reset_password"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_RESET_PASSWORD);
    cy.get('[id="email"]').type(TEST_CONSTANTS.UNKNOWN_EMAIL);
    cy.get('[id="BUTTON_reset_password"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_RESET_PASSWORD);
    cy.get('[id="error_message"]').should('exist');
    cy.contains(TEST_CONSTANTS.USER_NOT_FOUND);
  });
  it('E2E_User_12: Reset password with correct email address', () => {
    cy.visit(TEST_CONSTANTS.LOGIN_URL);
    cy.get('[id="LINK_reset_password"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_RESET_PASSWORD);
    cy.get('[id="email"]').type(TEST_CONSTANTS.UPDATED_EMAIL);
    cy.get('[id="BUTTON_reset_password"]').click();
    cy.get('h1')
      .invoke('text')
      .should('equal', TITLES.TITLE_RESET_PASSWORD_CONFIRMATION);
  });
  it('E2E_User_13: Login in with new email and password', () => {
    login(TEST_CONSTANTS.UPDATED_EMAIL, TEST_CONSTANTS.RESET_PASSWORD);
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SHOP);
  });
});
describe('Test logout', () => {
  it('E2E_User_14: Logout', () => {
    login(TEST_CONSTANTS.UPDATED_EMAIL, TEST_CONSTANTS.RESET_PASSWORD);
    cy.get('[id="LINK_header_username"]').click();
    cy.get('[id="LINK_header_logout"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_SHOP);
  });
});
describe('E2E_User_15: Test my orders', () => {
  it('Test there are no orders', () => {
    login(TEST_CONSTANTS.UPDATED_EMAIL, TEST_CONSTANTS.RESET_PASSWORD);
    cy.get('[id="LINK_header_username"]').click();
    cy.get('[id="LINK_my_orders"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_MY_ORDERS);
    cy.contains(TEST_CONSTANTS.YOU_HAVE_NO_ORDERS);
  });
});
describe('Test Administration of Users', () => {
  it('E2E_User_16: Admin login and open UserListScreen', () => {
    loginAsAdminAndGoToUserAdmin();
    cy.get('tr').should('have.length', 5); //4 users and header
  });
  it('E2E_User_17: Edit a user', () => {
    loginAsAdminAndGoToUserAdmin();
    cy.get('tr').should('have.length', 5); //4 users and header
    // Select user to administrate
    let queryId: string = `[id="edit_` + TEST_CONSTANTS.UPDATED_EMAIL + `"]`;
    cy.get(queryId).click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_EDIT_USER);
    // Change user name and email
    cy.get('[id="name"]').clear().type(TEST_CONSTANTS.NEW_USER_NAME);
    cy.get('[id="email"]').clear().type(TEST_CONSTANTS.NEW_USER_EMAIL);
    cy.get('[id="role"]').select(ADMIN_DISPLAY);
    cy.get('[id="BUTTON_update"]').click();
    // Check updated name and email are shown in users list
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_USER_ADMIN);
    cy.get('tr').should('have.length', 5); //4 users and header
    queryId = `[id="name_` + TEST_CONSTANTS.NEW_USER_EMAIL + `"]`;
    cy.get(queryId)
      .invoke('text')
      .should('equal', TEST_CONSTANTS.NEW_USER_NAME);
    queryId = `[id="email_` + TEST_CONSTANTS.NEW_USER_EMAIL + `"]`;
    cy.get(queryId)
      .invoke('text')
      .should('equal', TEST_CONSTANTS.NEW_USER_EMAIL);
    queryId = `[id="admin_` + TEST_CONSTANTS.NEW_USER_EMAIL + `"]`;
    cy.get(queryId)
      .find('svg')
      .should('have.css', 'color', TEST_CONSTANTS.COLOR_GREEN);
  });
  it('E2E_User_18: Delete a user', () => {
    loginAsAdminAndGoToUserAdmin();
    cy.get('tr').should('have.length', 5); //4 users and header
    // Test deleting a user
    let queryId: string = `[id="delete_` + TEST_CONSTANTS.NEW_USER_EMAIL + `"]`;
    cy.get(queryId).click();
    cy.contains(TEST_CONSTANTS.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_USER);
    cy.get('[id="BUTTON_yes"]').click();
    cy.get('h1').invoke('text').should('equal', TITLES.TITLE_USER_ADMIN);
    cy.get('tr').should('have.length', 4); //3 users and header
    queryId = `[id="email_` + TEST_CONSTANTS.NEW_USER_EMAIL + `"]`;
    cy.get(queryId).should('not.exist');
  });
});
