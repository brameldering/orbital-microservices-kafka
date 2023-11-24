import React from 'react';
import Link from 'next/link';

import FormContainer from 'form/FormContainer';
import Meta from 'components/Meta';

const ResetPasswordConfirmation = () => {
  return (
    <FormContainer>
      <Meta title='Reset Password' />
      <h1>Reset Password Confirmation</h1>
      <p>Your password has been reset to 123456</p>
      <p>
        In a future version of this application an email will be send containing
        a link to allow for securely resetting your password
      </p>
      <p>
        This email will then be send to the email entered in the previous screen
        (and only if that email is already known in our system)
      </p>
      <Link href='/auth/signin'>Go to Login screen</Link>
    </FormContainer>
  );
};

export default ResetPasswordConfirmation;
