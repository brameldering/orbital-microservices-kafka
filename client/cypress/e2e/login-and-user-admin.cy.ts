import {
  LOGIN_URL,
  TEST_USER_EMAIL,
  TEST_USER_PASSWORD,
  NEW_USER_NAME,
  NEW_USER_EMAIL,
  NEW_USER_PASSWORD,
  UNKNOWN_EMAIL,
  WRONG_PASSWORD,
  UPDATED_USER_NAME,
  UPDATED_EMAIL,
  UPDATED_PASSWORD,
  RESET_PASSWORD,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  THAT_EMAIL_ALREADY_EXISTS,
  INVALID_EMAIL_OR_PASSWORD,
  INVALID_EMAIL_ADDRESS,
  REQUIRED,
  USER_NOT_FOUND,
  YOU_HAVE_NO_ORDERS,
  COLOR_GREEN,
  ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_USER,
} from '../test_constants';
import {
  TITLE_SIGN_IN,
  TITLE_SIGN_UP,
  TITLE_PRODUCTS,
  TITLE_MY_PROFILE,
  TITLE_CHANGE_PASSWORD,
  TITLE_RESET_PASSWORD,
  TITLE_RESET_PASSWORD_CONFIRMATION,
  TITLE_USER_ADMIN,
  TITLE_EDIT_USER,
  TITLE_MY_ORDERS,
} from 'constants/form-titles';
import { CUSTOMER_DISPLAY, ADMIN_DISPLAY } from '@orbitelco/common';

const login = (email: string, password: string) => {
  cy.visit(LOGIN_URL);
  cy.get('[id="email"]').type(email);
  cy.get('[id="password"]').type(password);
  cy.get('[id="BUTTON_login"]').click();
};

const loginAsAdminAndGoToUserAdmin = () => {
  login(ADMIN_EMAIL, ADMIN_PASSWORD);
  cy.get('[id="LINK_header_adminmenu"]').click();
  cy.get('[id="LINK_header_users"]').click();
  cy.get('h1').invoke('text').should('equal', TITLE_USER_ADMIN);
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
    cy.visit(LOGIN_URL);
    cy.get('h1').invoke('text').should('equal', TITLE_SIGN_IN);
    cy.get('[id="LINK_register_new_customer"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_SIGN_UP);
    cy.get('[id="name"]').type(NEW_USER_NAME);
    cy.get('[id="email"]').type(NEW_USER_EMAIL);
    cy.get('[id="password"]').type(NEW_USER_PASSWORD);
    cy.get('[id="role"]').select(CUSTOMER_DISPLAY);
    cy.get('[id="BUTTON_register"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_PRODUCTS);
  });
  it('E2E_User_2: Opens register screen enters already existing account', () => {
    cy.visit(LOGIN_URL);
    cy.get('[id="LINK_register_new_customer"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_SIGN_UP);
    cy.get('[id="name"]').type(NEW_USER_NAME);
    cy.get('[id="email"]').type(NEW_USER_EMAIL);
    cy.get('[id="password"]').type(NEW_USER_PASSWORD);
    cy.get('[id="role"]').select(CUSTOMER_DISPLAY);
    cy.get('[id="BUTTON_register"]').click();
    cy.contains(THAT_EMAIL_ALREADY_EXISTS);
  });
  it('E2E_User_3: Opens register screen and clicks Login (Already have an account)', () => {
    cy.visit(LOGIN_URL);
    cy.get('[id="LINK_register_new_customer"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_SIGN_UP);
    cy.get('[id="LINK_already_have_an_account"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_SIGN_IN);
  });
});
describe('Test logging in', () => {
  it('E2E_User_4: Signs in correctly with test account', () => {
    login(TEST_USER_EMAIL, TEST_USER_PASSWORD);
    cy.get('h1').invoke('text').should('equal', TITLE_PRODUCTS);
  });
  it('E2E_User_5: Signs in with unknown account', () => {
    login(UNKNOWN_EMAIL, TEST_USER_PASSWORD);
    cy.contains(INVALID_EMAIL_OR_PASSWORD);
  });
  it('E2E_User_6: Signs in with incorrect password', () => {
    login(TEST_USER_EMAIL, WRONG_PASSWORD);
    cy.contains(INVALID_EMAIL_OR_PASSWORD);
  });
  it('E2E_User_7: Enters invalid email address and leaves password field empty', () => {
    cy.visit(LOGIN_URL);
    cy.get('[id="email"]').type('test');
    cy.get('[id="password"]').focus();
    cy.get('[id="error_text_email"]')
      .invoke('text')
      .should('equal', INVALID_EMAIL_ADDRESS);
    cy.get('[id="email"]').focus();
    cy.get('[id="error_text_password"]')
      .invoke('text')
      .should('equal', REQUIRED);
  });
});
describe('Test profile and password update', () => {
  it('E2E_User_8: Change username and email', () => {
    login(NEW_USER_EMAIL, NEW_USER_PASSWORD);
    cy.get('h1').invoke('text').should('equal', TITLE_PRODUCTS);
    cy.get('[id="LINK_header_username"]').click();
    cy.get('[id="LINK_my_profile"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_MY_PROFILE);
    cy.get('[id="name"]').clear().type(UPDATED_USER_NAME);
    cy.get('[id="email"]').clear().type(UPDATED_EMAIL);
    cy.get('[id="BUTTON_update"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_MY_PROFILE);
    cy.wait(1000); // Wait one second to let MongoDB process the update
    // Check there are no errors
    cy.get('[id="error_message"]').should('not.exist');
  });
  it('E2E_User_9: Change password', () => {
    login(UPDATED_EMAIL, NEW_USER_PASSWORD);
    cy.get('h1').invoke('text').should('equal', TITLE_PRODUCTS);
    cy.get('[id="LINK_header_username"]').click();
    cy.get('[id="LINK_my_profile"]').click();
    cy.get('[id="LINK_change_password"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_CHANGE_PASSWORD);
    cy.get('[id="currentPassword"]').type(NEW_USER_PASSWORD);
    cy.get('[id="newPassword"]').type(UPDATED_PASSWORD);
    cy.get('[id="BUTTON_update"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_MY_PROFILE);
    // Check there are no errors
    cy.get('[id="error_message"]').should('not.exist');
  });
  it('E2E_User_10: Login in with new email and password', () => {
    login(UPDATED_EMAIL, UPDATED_PASSWORD);
    cy.get('h1').invoke('text').should('equal', TITLE_PRODUCTS);
  });
  it('E2E_User_11: Tries to reset password with unknown email address', () => {
    cy.visit(LOGIN_URL);
    cy.get('[id="LINK_reset_password"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_RESET_PASSWORD);
    cy.get('[id="email"]').type(UNKNOWN_EMAIL);
    cy.get('[id="BUTTON_reset_password"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_RESET_PASSWORD);
    cy.get('[id="error_message"]').should('exist');
    cy.contains(USER_NOT_FOUND);
  });
  it('E2E_User_12: Reset password with correct email address', () => {
    cy.visit(LOGIN_URL);
    cy.get('[id="LINK_reset_password"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_RESET_PASSWORD);
    cy.get('[id="email"]').type(UPDATED_EMAIL);
    cy.get('[id="BUTTON_reset_password"]').click();
    cy.get('h1')
      .invoke('text')
      .should('equal', TITLE_RESET_PASSWORD_CONFIRMATION);
  });
  it('E2E_User_13: Login in with new email and password', () => {
    login(UPDATED_EMAIL, RESET_PASSWORD);
    cy.get('h1').invoke('text').should('equal', TITLE_PRODUCTS);
  });
});
describe('Test logout', () => {
  it('E2E_User_14: Logout', () => {
    login(UPDATED_EMAIL, RESET_PASSWORD);
    cy.get('[id="LINK_header_username"]').click();
    cy.get('[id="LINK_header_logout"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_PRODUCTS);
  });
});
describe('E2E_User_15: Test my orders', () => {
  it('Test there are no orders', () => {
    login(UPDATED_EMAIL, RESET_PASSWORD);
    cy.get('[id="LINK_header_username"]').click();
    cy.get('[id="LINK_my_orders"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_MY_ORDERS);
    cy.contains(YOU_HAVE_NO_ORDERS);
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
    let queryId: string = `[id="edit_` + UPDATED_EMAIL + `"]`;
    cy.get(queryId).click();
    cy.get('h1').invoke('text').should('equal', TITLE_EDIT_USER);
    // Change user name and email
    cy.get('[id="name"]').clear().type(NEW_USER_NAME);
    cy.get('[id="email"]').clear().type(NEW_USER_EMAIL);
    cy.get('[id="role"]').select(ADMIN_DISPLAY);
    cy.get('[id="BUTTON_update"]').click();
    // Check updated name and email are shown in users list
    cy.get('h1').invoke('text').should('equal', TITLE_USER_ADMIN);
    cy.get('tr').should('have.length', 5); //4 users and header
    queryId = `[id="name_` + NEW_USER_EMAIL + `"]`;
    cy.get(queryId).invoke('text').should('equal', NEW_USER_NAME);
    queryId = `[id="email_` + NEW_USER_EMAIL + `"]`;
    cy.get(queryId).invoke('text').should('equal', NEW_USER_EMAIL);
    queryId = `[id="admin_` + NEW_USER_EMAIL + `"]`;
    cy.get(queryId).find('svg').should('have.css', 'color', COLOR_GREEN);
  });
  it('E2E_User_18: Delete a user', () => {
    loginAsAdminAndGoToUserAdmin();
    cy.get('tr').should('have.length', 5); //4 users and header
    // Test deleting a user
    let queryId: string = `[id="delete_` + NEW_USER_EMAIL + `"]`;
    cy.get(queryId).click();
    cy.contains(ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_USER);
    cy.get('[id="BUTTON_yes"]').click();
    cy.get('h1').invoke('text').should('equal', TITLE_USER_ADMIN);
    cy.get('tr').should('have.length', 4); //3 users and header
    queryId = `[id="email_` + NEW_USER_EMAIL + `"]`;
    cy.get(queryId).should('not.exist');
  });
});
