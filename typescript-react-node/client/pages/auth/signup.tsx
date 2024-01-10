import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextPageContext } from 'next';
import Router, { useRouter } from 'next/router';
import NextLink from 'next/link';
import MuiLink from '@mui/material/Link';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid } from '@mui/material';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { TextNumField, PasswordField, SelectField } from 'form/FormComponents';
import { textField, passwordField } from 'form/ValidationSpecs';
import FormButtonBox from 'form/FormButtonBox';
import { SubmitButton } from 'form/FormButtons';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
import { getRoles } from 'api/roles/get-roles';
import type { RootState } from 'slices/store';
import { setUserState } from 'slices/authSlice';
import { useSignUpMutation } from 'slices/usersApiSlice';

interface IFormInput {
  name: string;
  email: string;
  password: string;
  role: string;
}

const schema = yup.object().shape({
  name: textField().max(25).required('Required'),
  email: textField().required('Required').email('Invalid email address'),
  password: passwordField(),
  role: yup.string().required('Required'),
});

interface TPageProps {
  roles: Array<{ role: string; roleDisplay: string }>;
  error?: string[];
}

const SignUpScreen: React.FC<TPageProps> = ({ roles, error }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const {
    register,
    control,
    handleSubmit,
    // setValue,
    getValues,
    // reset,
    setError,
    // watch,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { name: '', email: '', password: '', role: '' },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  // Extract the 'redirect' query parameter with a default value of PAGES.PRODUCTS_PAGE
  const router = useRouter();
  const { query } = router;
  const redirect = query.redirect || PAGES.PRODUCTS_PAGE;
  const redirectString = Array.isArray(redirect) ? redirect[0] : redirect;

  useEffect(() => {
    if (userInfo) {
      router.push(redirect.toString());
    }
  }, [router, redirect, userInfo]);

  const [doSignUp, { isLoading: isProcessing, error: errorSigninUp }] =
    useSignUpMutation();
  const onSubmit = async () => {
    const name = getValues('name');
    const email = getValues('email');
    const password = getValues('password');
    const role = getValues('role');
    try {
      const createdUser = await doSignUp({
        name,
        email,
        password,
        role,
      }).unwrap();
      dispatch(setUserState(createdUser));
      Router.push(redirectString);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const selectRoles = [
    { label: 'Select role', value: '' },
    ...roles.map((role) => ({ label: role.roleDisplay, value: role.role })),
  ];

  return (
    <>
      <Meta title={TITLES.TITLE_SIGN_UP} />
      <FormContainer>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <Grid container justifyContent='space-between' alignItems='center'>
            <Grid item>
              <FormTitle>{TITLES.TITLE_SIGN_UP}</FormTitle>
            </Grid>
            <Grid item>
              Already have an account?{'  '}
              <MuiLink
                id='LINK_already_have_an_account'
                href={
                  redirect
                    ? `${PAGES.SIGNIN_PAGE}?redirect=${redirect}`
                    : PAGES.SIGNIN_PAGE
                }
                component={NextLink}>
                Login
              </MuiLink>
            </Grid>
          </Grid>

          {error ? (
            <ErrorBlock error={error} />
          ) : (
            <>
              <TextNumField
                controlId='name'
                label='Full Name'
                register={register}
                error={errors.name}
                setError={setError}
              />
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
              <SelectField
                controlId='role'
                options={selectRoles}
                control={control}
                error={errors.role}
                setError={setError}
              />
              {errorSigninUp && <ErrorBlock error={errorSigninUp} />}
              <FormButtonBox>
                <SubmitButton
                  id='BUTTON_register'
                  disabled={isProcessing || !isDirty}
                  label='Sign Up'
                />
              </FormButtonBox>
            </>
          )}
        </Box>
        {isProcessing && <Loader />}
      </FormContainer>
    </>
  );
};

// Fetch Roles (to fill dropdown box)
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const roles = await getRoles(context);
    return {
      props: { roles },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { roles: [], error: parsedError },
    };
  }
};

export default SignUpScreen;
