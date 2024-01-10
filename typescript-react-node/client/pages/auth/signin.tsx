import React from 'react';
import { useDispatch } from 'react-redux';
import Router, { useRouter } from 'next/router';
import NextLink from 'next/link';
import MuiLink from '@mui/material/Link';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid } from '@mui/material';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { TextNumField, PasswordField } from 'form/FormComponents';
import { textField, passwordField } from 'form/ValidationSpecs';
import FormButtonBox from 'form/FormButtonBox';
import { SubmitButton } from 'form/FormButtons';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
import { setUserState } from 'slices/authSlice';
import { useSignInMutation } from 'slices/usersApiSlice';

interface IFormInput {
  email: string;
  password: string;
}
const schema = yup.object().shape({
  email: textField().required('Required').email('Invalid email address'),
  password: passwordField(),
});

const SignInScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  // Extract the 'redirect' query parameter with a default value of PAGES.PRODUCTS_PAGE
  const router = useRouter();
  const { query } = router;
  const redirect = query.redirect || PAGES.PRODUCTS_PAGE;

  const [doSignIn, { isLoading: isProcessing, error: errorSigninIn }] =
    useSignInMutation();
  const onSubmit = async () => {
    const email = getValues('email');
    const password = getValues('password');
    try {
      const signedInUser = await doSignIn({ email, password }).unwrap();
      dispatch(setUserState(signedInUser));
      Router.push(redirect.toString());
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const onError = (error: any) => {
    console.error('ERROR:::', error);
  };

  return (
    <>
      <Meta title={TITLES.TITLE_SIGN_IN} />
      <FormContainer>
        <Box component='form' onSubmit={handleSubmit(onSubmit, onError)}>
          <FormTitle>{TITLES.TITLE_SIGN_IN}</FormTitle>
          <TextNumField
            controlId='email'
            label='Email'
            register={register}
            error={errors.email}
            setError={setError}
          />
          <PasswordField
            controlId='password'
            label='Password'
            register={register}
            error={errors.password}
            setError={setError}
          />
          {errorSigninIn && <ErrorBlock error={errorSigninIn} />}
          <FormButtonBox>
            <SubmitButton
              id='BUTTON_login'
              disabled={isProcessing || !isDirty}
              label='Sign In'
            />
          </FormButtonBox>
        </Box>
        <Grid
          container
          sx={{
            mt: 1,
          }}>
          <Grid item>
            New Customer?{'  '}
            <MuiLink
              id='LINK_register_new_customer'
              href={
                redirect
                  ? `${PAGES.SIGNUP_PAGE}?redirect=${redirect}`
                  : PAGES.SIGNUP_PAGE
              }
              component={NextLink}>
              Register
            </MuiLink>
          </Grid>
        </Grid>
        <Grid container>
          <Grid
            item
            sx={{
              mt: 1,
            }}>
            Password forgotten?{'  '}
            <MuiLink
              id='LINK_reset_password'
              href={PAGES.RESET_PASSWORD_PAGE}
              component={NextLink}>
              Reset password
            </MuiLink>
          </Grid>
        </Grid>
        {isProcessing && <Loader />}
      </FormContainer>
    </>
  );
};

export default SignInScreen;
