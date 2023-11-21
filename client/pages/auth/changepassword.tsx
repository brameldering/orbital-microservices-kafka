import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
// import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormContainer from '../../form/FormContainer';
import { PasswordField } from '../../form/FormComponents';
import { passwordField } from 'form/ValidationSpecs';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ModalConfirmBox from 'components/ModalConfirmBox';
import ErrorBlock from 'components/ErrorBlock';
import { ICurrentUser } from 'types/user-types';
// import { useChangePasswordMutation } from 'slices/usersApiSlice';
// import { getCurrentUser } from 'api/get-current-user';
import useRequest from 'hooks/use-request';
import { BASE_URL } from 'constants/constants-frontend';
import { UPDATE_PASSWORD_URL } from '@orbitelco/common';

interface IFormInput {
  currentPassword: string;
  newPassword: string;
}

const schema = yup.object().shape({
  currentPassword: passwordField(),
  newPassword: passwordField(),
});

interface TPageProps {
  currentUser?: ICurrentUser;
}

const ChangePasswordScreen: React.FC<TPageProps> = () => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { currentPassword: '', newPassword: '' },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const {
    doRequest,
    isProcessing,
    error: errorChanging,
  } = useRequest({
    url: BASE_URL + UPDATE_PASSWORD_URL,
    method: 'put',
    onSuccess: () => {
      toast.success('Password updated');
      reset();
      Router.push('/auth/profilescreen');
    },
  });

  const onSubmit = async () => {
    const currentPassword = getValues('currentPassword');
    const newPassword = getValues('newPassword');
    await doRequest({ body: { currentPassword, newPassword } });
  };

  const onError = (error: any) => {
    console.log('ERROR:::', error);
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push('/auth/profilescreen');
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push('/auth/profilescreen');
    }
  };

  return (
    <>
      <Meta title='Change Password' />{' '}
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <Button
        className='btn btn-light my-3'
        onClick={goBackHandler}
        disabled={isProcessing}>
        Go Back
      </Button>
      <FormContainer>
        <h1 className='mb-4'>Change Password</h1>
        {isProcessing && <Loader />}
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <PasswordField
            controlId='currentPassword'
            label='Current Password'
            register={register}
            error={errors.currentPassword}
          />
          <PasswordField
            controlId='newPassword'
            label='New Password'
            register={register}
            error={errors.newPassword}
          />
          {errorChanging && <ErrorBlock error={errorChanging} />}
          <Button
            id='BUTTON_update'
            type='submit'
            variant='primary mt-2'
            disabled={isProcessing || !isDirty}>
            Update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

// export const getServerSideProps = async (context: NextPageContext) => {
//   const { data } = await getCurrentUser(context);
//   return { props: data };
// };

export default ChangePasswordScreen;
