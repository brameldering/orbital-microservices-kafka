import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { passwordField } from '../../components/form/ValidationSpecs';
import FormContainer from '../../components/form/FormContainer';
import { PasswordField } from '../../components/form/FormComponents';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import { ErrorMessage } from '../../components/general/Messages';
import ModalConfirmBox from '../../components/general/ModalConfirmBox';
import { setCredentials } from '../../slices/authSlice';
import { useUpdatePasswordMutation } from '../../slices/usersApiSlice';

const ChangePasswordScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [
    updatePassword,
    { isLoading: updatingPassword, error: errorUpdating },
  ] = useUpdatePasswordMutation();

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
    },
    validationSchema: Yup.object({
      currentPassword: passwordField(),
      newPassword: passwordField(),
    }),
    onSubmit: async (values) => {
      const currentPassword = values.currentPassword;
      const newPassword = values.newPassword;
      try {
        const res = await updatePassword({
          _id: userInfo._id,
          currentPassword,
          newPassword,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Password updated');
        navigate('/profile');
      } catch (err) {
        // Do nothing because useUpdateProfileMutation will set errorUpdating in case of an error
      }
    },
  });

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    navigate('/profile');
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (formik.dirty) {
      setShowChangesModal(true);
    } else {
      navigate('/profile');
    }
  };

  const buttonDisabled = updatingPassword;

  return (
    <>
      <Meta title='Change Password' />{' '}
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Discard Changes'
        body='You have made changes that have not yet been saved.  Do you want to go back and discard these changes?'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <Button
        className='btn btn-light my-3'
        onClick={goBackHandler}
        disabled={buttonDisabled}>
        Go Back
      </Button>
      <FormContainer>
        <h1>Change Password</h1>
        {errorUpdating && <ErrorMessage error={errorUpdating} />}
        <Form>
          <PasswordField
            controlId='currentPassword'
            label='Current Password'
            formik={formik}
          />
          <PasswordField
            controlId='newPassword'
            label='New Password'
            formik={formik}
          />
          <Button
            onClick={formik.handleSubmit}
            disabled={buttonDisabled}
            type='submit'
            variant='primary mt-2'>
            Update
          </Button>
          {updatingPassword && <Loader />}
        </Form>
      </FormContainer>
    </>
  );
};

export default ChangePasswordScreen;
