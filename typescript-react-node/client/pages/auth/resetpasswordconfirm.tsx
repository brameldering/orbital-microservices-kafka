import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormTitle from 'form/FormTitle';
import FormContainer from 'form/FormContainer';
import Meta from 'components/Meta';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';

const ResetPasswordConfirmation = () => {
  return (
    <FormContainer>
      <Meta title={TITLES.TITLE_RESET_PASSWORD_CONFIRMATION} />
      <FormTitle>{TITLES.TITLE_RESET_PASSWORD_CONFIRMATION}</FormTitle>
      <Typography paragraph>Your password has been reset to 123456</Typography>
      <Typography paragraph>
        In a future version of this application an email will be send containing
        a link to allow for securely resetting your password
      </Typography>
      <Typography paragraph>
        This email will then be send to the email entered in the previous screen
        (and only if that email is already known in our system)
      </Typography>
      <Box mt={2}>
        <Link href={PAGES.SIGNIN_PAGE}>Go to Login screen</Link>
      </Box>
    </FormContainer>
  );
};

export default ResetPasswordConfirmation;
