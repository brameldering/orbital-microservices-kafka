describe('Test logging in', () => {
  beforeEach(() => cy.visit('http://localhost:3000/login'));
  it('Opens Sign In page', () => {
    cy.get('h1').invoke('text').should('equal', 'Sign In');
  });
  it('Signs in correctly with admin account', () => {
    cy.get('[id="email"]').type('admin@email.com');
    cy.get('[id="password"]').type('123456');
    cy.get('[id="LoginScreen-login-button"]').click();
    cy.get('h1').invoke('text').should('equal', 'Products');
  });
  it('Signs in with unknown account', () => {
    cy.get('[id="email"]').type('admin2@email.com');
    cy.get('[id="password"]').type('123456');
    cy.get('[id="LoginScreen-login-button"]').click();
    cy.get('[id="alert-error"]')
      .invoke('text')
      .should('equal', 'Invalid email or password');
  });
  it('Signs in with incorrect password', () => {
    cy.get('[id="email"]').type('admin@email.com');
    cy.get('[id="password"]').type('1234567');
    cy.get('[id="LoginScreen-login-button"]').click();
    cy.get('[id="alert-error"]')
      .invoke('text')
      .should('equal', 'Invalid email or password');
  });
  it('Enters invalid email address and leaves password field empty', () => {
    cy.get('[id="email"]').type('test');
    cy.get('[id="password"]').focus();
    cy.get('[id="error-text-email"]')
      .invoke('text')
      .should('equal', 'Invalid email address');
    cy.get('[id="email"]').focus();
    cy.get('[id="error-text-password"]')
      .invoke('text')
      .should('equal', 'Required');
  });
});
describe('Test Registering', () => {
  beforeEach(() => cy.visit('http://localhost:3000/login'));
  it('Opens Sign In page', () => {
    cy.get('h1').invoke('text').should('equal', 'Sign In');
  });
  it('Opens register screen', () => {
    cy.get('[id="register_new_customer"]').click();
    cy.get('h1').invoke('text').should('equal', 'Register account');
  });
});
