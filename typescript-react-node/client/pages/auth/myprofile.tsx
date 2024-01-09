import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { TextNumField } from 'form/FormComponents';
import { textField } from 'form/ValidationSpecs';
import { UpdateSubmitButton } from 'form/FormButtons';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import { TITLE_MY_PROFILE } from 'constants/form-titles';
import { CHANGE_PASSWORD_PAGE } from 'constants/client-pages';
import type { RootState } from 'slices/store';
import { updUserState } from 'slices/authSlice';
import { useChangeUserProfileMutation } from 'slices/usersApiSlice';

interface IFormInput {
  name: string;
  email: string;
}

const schema = yup.object().shape({
  name: textField().max(80).required('Required'),
  email: textField()
    .max(40)
    .required('Required')
    .email('Invalid email address'),
});

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { name: userInfo?.name, email: userInfo?.email },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const [changeUserProfile, { isLoading: isProcessing, error: errorChanging }] =
    useChangeUserProfileMutation();
  const onSubmit = async () => {
    try {
      const updatedUser = await changeUserProfile({
        name: getValues('name'),
        email: getValues('email'),
      }).unwrap();
      dispatch(updUserState(updatedUser));
      toast.success('Profile updated');
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const onError = (error: any) => {
    console.error('ERROR:::', error);
  };

  return (
    <>
      <Meta title={TITLE_MY_PROFILE} />
      <FormContainer>
        <Box component='form' onSubmit={handleSubmit(onSubmit, onError)}>
          <FormTitle>{TITLE_MY_PROFILE}</FormTitle>
          <TextNumField
            controlId='name'
            label='Full name'
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
          {errorChanging && <ErrorBlock error={errorChanging} />}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 3,
            }}>
            <UpdateSubmitButton disabled={isProcessing || !isDirty} />
            <Link
              id='LINK_change_password'
              href={CHANGE_PASSWORD_PAGE}
              passHref>
              <Button component='a' variant='outlined'>
                Change Password
              </Button>
            </Link>
          </Box>
          {isProcessing && <Loader />}
        </Box>
      </FormContainer>
    </>
  );
};

export default ProfileScreen;
