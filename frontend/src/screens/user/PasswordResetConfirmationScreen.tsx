import React from 'react';
import { Link } from 'react-router-dom';

import FormContainer from '../../components/form/FormContainer';
import Meta from '../../components/general/Meta';

const PasswordResetConfirmation = () => {
  return (
    <FormContainer>
      <Meta title='Reset Password' />
      <h1>Reset Password Confirmation</h1>
      <p>
        Your password has been reset to
        &quot;escaped&quot;123456&quot;escaped&quot;
      </p>
      <p>
        In a future version of this application an email will be send containing
        a link to allow for securely resetting your password
      </p>
      <p>
        This email will then be send to the email entered in the previous screen
        (and only if that email is already known in our system)
      </p>
      <Link to='/login'>Go to Login screen</Link>
    </FormContainer>
  );
};

export default PasswordResetConfirmation;
