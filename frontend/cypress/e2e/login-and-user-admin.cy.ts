describe('Test registration of new account', () => {
  beforeEach(() => cy.visit('http://localhost:3000/login'));
  it('Opens Sign In page', () => {
    cy.get('h1').invoke('text').should('equal', 'Sign In');
  });
  it('Opens register screen and enters new account', () => {
    cy.get('[id="Login-screen-register_new_customer"]').click();
    cy.get('h1').invoke('text').should('equal', 'Register account');
    cy.get('[id="name"]').type('User Name');
    cy.get('[id="email"]').type('test.user@test.com');
    cy.get('[id="password"]').type('StandardP@ssw0rd');
    cy.get('[id="RegisterScreen-register-button"]').click();
    cy.get('h1').invoke('text').should('equal', 'Products');
  });
  it('Opens register screen enters already existing account', () => {
    cy.get('[id="Login-screen-register_new_customer"]').click();
    cy.get('h1').invoke('text').should('equal', 'Register account');
    cy.get('[id="name"]').type('User Name');
    cy.get('[id="email"]').type('test.user@test.com');
    cy.get('[id="password"]').type('StandardP@ssw0rd');
    cy.get('[id="RegisterScreen-register-button"]').click();
    cy.get('[id="alert-error"]')
      .invoke('text')
      .should('equal', 'That email already exists');
  });
  it('Opens register screen and clicks Login (Already have an account)', () => {
    cy.get('[id="Login-screen-register_new_customer"]').click();
    cy.get('h1').invoke('text').should('equal', 'Register account');
    cy.get('[id="Register-screen-already_have_account"]').click();
    cy.get('h1').invoke('text').should('equal', 'Sign In');
  });
});
describe('Test logging in', () => {
  beforeEach(() => cy.visit('http://localhost:3000/login'));
  it('Opens Sign In page', () => {
    cy.get('h1').invoke('text').should('equal', 'Sign In');
  });
  it('Signs in correctly with test account', () => {
    cy.get('[id="email"]').type('test.user@test.com');
    cy.get('[id="password"]').type('StandardP@ssw0rd');
    cy.get('[id="LoginScreen-login-button"]').click();
    cy.get('h1').invoke('text').should('equal', 'Products');
  });
  it('Signs in with unknown account', () => {
    cy.get('[id="email"]').type('unknown.user@test.com');
    cy.get('[id="password"]').type('StandardP@ssw0rd');
    cy.get('[id="LoginScreen-login-button"]').click();
    cy.get('[id="alert-error"]')
      .invoke('text')
      .should('equal', 'Invalid email or password');
  });
  it('Signs in with incorrect password', () => {
    cy.get('[id="email"]').type('test.user@test.com');
    cy.get('[id="password"]').type('Wr0ngP@ssw0rd');
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
describe('Test profile and password update', () => {
  beforeEach(() => cy.visit('http://localhost:3000/login'));
  it('Change username and email and password', () => {
    cy.get('[id="email"]').type('test.user@test.com');
    cy.get('[id="password"]').type('StandardP@ssw0rd');
    cy.get('[id="LoginScreen-login-button"]').click();
    cy.get('h1').invoke('text').should('equal', 'Products');
    // cy.visit('http://localhost:3000/profile');
    cy.get('[id="header-username"]').click();
    cy.get('[id="header-my-profile"]').click();
    cy.get('h1').invoke('text').should('equal', 'My Profile');
    cy.get('[id="name"]').clear().type('Updated User Name');
    cy.get('[id="email"]').clear().type('test.user.updated.name@test.com');
    cy.get('[id="ProfileScreen-update-button"]').click();
    cy.get('alert-error').should('not.exist');
    cy.get('error-message').should('not.exist');
  });
  it('Change password', () => {
    cy.get('[id="email"]').type('test.user.updated.name@test.com');
    cy.get('[id="password"]').type('StandardP@ssw0rd');
    cy.get('[id="LoginScreen-login-button"]').click();
    cy.get('h1').invoke('text').should('equal', 'Products');
    cy.get('[id="header-username"]').click();
    cy.get('[id="header-my-profile"]').click();
    cy.get('[id="ProfileScreen-change-password"]').click();
    cy.get('h1').invoke('text').should('equal', 'Change Password');
    cy.get('[id="currentPassword"]').type('StandardP@ssw0rd');
    cy.get('[id="newPassword"]').type('NewP@ssw0rd');
    cy.get('[id="ChangePasswordScreen-update-button"]').click();
    cy.get('alert-error').should('not.exist');
    cy.get('error-message').should('not.exist');
  });
  it('Login in with new email and password', () => {
    cy.get('[id="email"]').type('test.user.updated.name@test.com');
    cy.get('[id="password"]').type('NewP@ssw0rd');
    cy.get('[id="LoginScreen-login-button"]').click();
    cy.get('h1').invoke('text').should('equal', 'Products');
  });
  it('Opens Reset Password page from login screen', () => {
    cy.get('[id="Login-screen-reset_password"]').click();
    cy.get('h1').invoke('text').should('equal', 'Reset Password');
  });
  it('Tries to reset password with unknown email address', () => {
    cy.get('[id="Login-screen-reset_password"]').click();
    cy.get('[id="email"]').type('unknown@test.com');
    cy.get('[id="PasswordResetScreen-reset-password-button"]').click();
    cy.get('h1').invoke('text').should('equal', 'Reset Password');
    cy.get('[id="alert-error"]')
      .invoke('text')
      .should('equal', 'This email address is not known to us');
  });
  it('Reset password with correct email address', () => {
    cy.get('[id="Login-screen-reset_password"]').click();
    cy.get('[id="email"]').type('test.user.updated.name@test.com');
    cy.get('[id="PasswordResetScreen-reset-password-button"]').click();
    cy.get('h1').invoke('text').should('equal', 'Reset Password Confirmation');
  });
  it('Login in with new email and password', () => {
    cy.get('[id="email"]').type('test.user.updated.name@test.com');
    cy.get('[id="password"]').type('123456');
    cy.get('[id="LoginScreen-login-button"]').click();
    cy.get('h1').invoke('text').should('equal', 'Products');
  });
});
describe('Test logout', () => {
  beforeEach(() => cy.visit('http://localhost:3000/login'));
  it('Logout', () => {
    cy.get('[id="email"]').type('test.user.updated.name@test.com');
    cy.get('[id="password"]').type('123456');
    cy.get('[id="LoginScreen-login-button"]').click();
    cy.get('[id="header-username"]').click();
    cy.get('[id="header-logout"]').click();
    cy.get('h1').invoke('text').should('equal', 'Sign In');
  });
});
describe('Test my orders', () => {
  beforeEach(() => cy.visit('http://localhost:3000/login'));
  it('Test there are no orders', () => {
    cy.get('[id="email"]').type('test.user.updated.name@test.com');
    cy.get('[id="password"]').type('123456');
    cy.get('[id="LoginScreen-login-button"]').click();
    cy.get('[id="header-username"]').click();
    cy.get('[id="header-my-orders"]').click();
    cy.get('h2').invoke('text').should('equal', 'My Orders');
    cy.contains('You have no orders');
  });
});
describe('Test Administration of Users', () => {
  beforeEach(() => cy.visit('http://localhost:3000/login'));
  it('Edit and delete a user by admin account', () => {
    cy.get('h1').invoke('text').should('equal', 'Sign In');
    cy.get('[id="email"]').type('admin@email.com');
    cy.get('[id="password"]').type('123456');
    cy.get('[id="LoginScreen-login-button"]').click();
    cy.get('h1').invoke('text').should('equal', 'Products');
    cy.get('[id="header-adminmenu"]').click();
    cy.get('[id="header-users"]').click();
    cy.get('h1').invoke('text').should('equal', 'Users');
    cy.get('alert-error').should('not.exist');
    cy.get('error-message').should('not.exist');
    cy.get('[id="edit-test.user.updated.name@test.com"]').click();
    cy.get('h1').invoke('text').should('equal', 'Edit User');
    cy.get('[id="name"]').clear().type('User Name');
    cy.get('[id="email"]').clear().type('test.user@test.com');
    cy.get('[type="checkbox"]').check();
    cy.get('[id="UserEditScreen-update-button"]').click();
    cy.get('h1').invoke('text').should('equal', 'Users');
    cy.get('[id="name-test.user@test.com"]')
      .invoke('text')
      .should('equal', 'User Name');
    cy.get('[id="email-test.user@test.com"]')
      .invoke('text')
      .should('equal', 'test.user@test.com');
    cy.get('[id="admin-test.user@test.com"]')
      .find('svg')
      .should('have.css', 'color', 'rgb(0, 128, 0)');
    cy.get('[id="delete-test.user@test.com"]').click();
    cy.contains('Are you sure you want to delete this user?');
    cy.get('[id="modal-confirm-button-yes"]').click();
    cy.get('[id="email-test.user@test.com"]').should('not.exist');
  });
});
