import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { textField } from '../../components/form/ValidationSpecs';
import FormContainer from '../../components/form/FormContainer';
import {
  TextField,
  EmailField,
  CheckBoxField,
} from '../../components/form/FormComponents';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import { ErrorMessage } from '../../components/general/Messages';
import ModalConfirmBox from '../../components/general/ModalConfirmBox';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  let userId: string = '';
  if (id && id.length > 0) {
    userId = id;
  }

  const {
    data: user,
    isLoading,
    error: errorLoading,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: updating, error: errorUpdating }] =
    useUpdateUserMutation();

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      isAdmin: user?.isAdmin || false,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: textField().required('required'),
      email: textField().required('required').email('Invalid email address'),
    }),
    onSubmit: async (values) => {
      const name = values.name;
      const email = values.email;
      const isAdmin = values.isAdmin;
      try {
        await updateUser({ _id: userId, name, email, isAdmin }).unwrap();
        toast.success('User updated');
        refetch();
        navigate('/admin/userlist');
      } catch (err) {
        // Do nothing because useUpdateUserMutation will set errorUpdating in case of an error
      }
    },
  });

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    navigate('/admin/userlist');
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (formik.dirty) {
      setShowChangesModal(true);
    } else {
      navigate('/admin/userlist');
    }
  };

  const disableSubmit = isLoading || updating;

  return (
    <>
      <Meta title='Edit User' />
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
        disabled={disableSubmit}>
        Go Back
      </Button>
      <FormContainer>
        <h1>Edit User</h1>
        {errorUpdating && <ErrorMessage error={errorUpdating} />}
        {isLoading ? (
          <Loader />
        ) : errorLoading ? (
          <ErrorMessage error={errorLoading} />
        ) : (
          <Form onSubmit={formik.handleSubmit}>
            <TextField controlId='name' label='Full name' formik={formik} />
            <EmailField controlId='email' label='Email' formik={formik} />
            <CheckBoxField
              controlId='isAdmin'
              label='Is Admin'
              formik={formik}
            />
            <Button
              type='submit'
              variant='primary'
              className='mt-2'
              disabled={disableSubmit}>
              Update
            </Button>
            {updating && <Loader />}
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
