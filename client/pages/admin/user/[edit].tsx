import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { NextPageContext } from 'next';
import Router, { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextNumField, SelectField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import { textField } from 'form/ValidationSpecs';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import ModalConfirmBox from 'components/ModalConfirmBox';
import { updUserState } from 'slices/authSlice';
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from 'slices/usersApiSlice';
import { getUserRoles } from 'api/get-user-roles';
import { USER_LIST_PAGE } from 'constants/client-pages';

interface IFormInput {
  name: string;
  email: string;
  role: string;
}

const schema = yup.object().shape({
  name: textField().required('Name is required'),
  email: textField()
    .required('Email is required')
    .email('Invalid email address'),
  role: yup.string().required('Role is required'),
});

interface TPageProps {
  roles: Array<{ role: string; desc: string }>;
}

const UserEditScreen: React.FC<TPageProps> = ({ roles }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  // The name edit should match the name of [edit].tsx
  const id = router.query.edit as string | string[] | undefined;
  let userId = Array.isArray(id) ? id[0] : id;
  if (!userId) {
    userId = '';
  }

  const {
    data: user,
    isLoading,
    error: errorLoading,
    refetch,
  } = useGetUserByIdQuery(userId);

  const [updateUser, { isLoading: updating, error: errorUpdating }] =
    useUpdateUserMutation();

  const {
    register,
    control,
    handleSubmit,
    // setValue,
    getValues,
    reset,
    setError,
    // watch,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    const name = getValues('name');
    const email = getValues('email');
    const role = getValues('role');
    try {
      const res = await updateUser({
        id: userId!,
        name,
        email,
        role,
      }).unwrap();
      reset();
      dispatch(updUserState({ ...res }));
      toast.success('User updated');
      refetch();
      Router.push(USER_LIST_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(USER_LIST_PAGE);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(USER_LIST_PAGE);
    }
  };

  const selectRoles = [
    { label: 'Select role', value: '' },
    ...roles.map((role) => ({ label: role.desc, value: role.role })),
  ];

  const loadingOrProcessing = isLoading || updating;

  return (
    <>
      <Meta title='Edit User' />
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
        disabled={loadingOrProcessing}>
        Go Back
      </Button>
      <FormContainer>
        <h1>Edit User</h1>
        {errorUpdating && <ErrorBlock error={errorUpdating} />}
        {isLoading ? (
          <Loader />
        ) : errorLoading ? (
          <ErrorBlock error={errorLoading} />
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
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
            <SelectField
              controlId='role'
              options={selectRoles}
              control={control}
              error={errors.role}
              setError={setError}
            />
            <Button
              id='BUTTON_update'
              type='submit'
              variant='primary'
              className='mt-2'
              disabled={loadingOrProcessing || !isDirty}>
              Update
            </Button>
            {updating && <Loader />}
          </Form>
        )}
      </FormContainer>
    </>
  );
};

// Fetch User Roles (to fill dropdown box)
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const roles = await getUserRoles(context);
    return {
      props: { roles },
    };
  } catch (error) {
    // Handle errors if any
    console.error('Error fetching data:', error);
    return {
      props: { roles: [] },
    };
  }
};

export default UserEditScreen;
