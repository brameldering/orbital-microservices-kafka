import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { PasswordField } from 'form/FormComponents';
import { passwordField } from 'form/ValidationSpecs';
import FormButtonBox from 'form/FormButtonBox';
import { UpdateSubmitButton, CancelButton } from 'form/FormButtons';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ModalConfirmBox from 'components/ModalConfirmBox';
import ErrorBlock from 'components/ErrorBlock';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
import { useChangePasswordMutation } from 'slices/usersApiSlice';

interface IFormInput {
  currentPassword: string;
  newPassword: string;
}

const schema = yup.object().shape({
  currentPassword: passwordField(),
  newPassword: passwordField(),
});

const ChangePasswordScreen: React.FC = () => {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { currentPassword: '', newPassword: '' },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const [changePassword, { isLoading: isProcessing, error: errorChanging }] =
    useChangePasswordMutation();
  const onSubmit = async () => {
    const currentPassword = getValues('currentPassword');
    const newPassword = getValues('newPassword');
    try {
      await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();
      toast.success('Password updated');
      Router.push(PAGES.MY_PROFILE_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const onError = (error: any) => {
    console.error('ERROR:::', error);
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(PAGES.MY_PROFILE_PAGE);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(PAGES.MY_PROFILE_PAGE);
    }
  };

  return (
    <>
      <Meta title={TITLES.TITLE_CHANGE_PASSWORD} />
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <FormContainer>
        <Box component='form' onSubmit={handleSubmit(onSubmit, onError)}>
          <FormTitle>{TITLES.TITLE_CHANGE_PASSWORD}</FormTitle>
          <PasswordField
            controlId='currentPassword'
            label='Current Password'
            register={register}
            error={errors.currentPassword}
            setError={setError}
          />
          <PasswordField
            controlId='newPassword'
            label='New Password'
            register={register}
            error={errors.newPassword}
            setError={setError}
          />
          {errorChanging && <ErrorBlock error={errorChanging} />}
          <FormButtonBox>
            <CancelButton disabled={isProcessing} onClick={goBackHandler} />
            <UpdateSubmitButton disabled={isProcessing || !isDirty} />
          </FormButtonBox>

          {isProcessing && <Loader />}
        </Box>
      </FormContainer>
    </>
  );
};

export default ChangePasswordScreen;
