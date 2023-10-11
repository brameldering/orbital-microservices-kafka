import React from 'react';

import RegisterScreen from './RegisterScreen';

describe('<RegisterScreen />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<RegisterScreen />);
  });
});
