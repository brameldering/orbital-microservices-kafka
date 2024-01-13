import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { TextNumField, SelectField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { textField } from 'form/ValidationSpecs';
import FormButtonBox from 'form/FormButtonBox';
import { UpdateSubmitButton, CancelButton } from 'form/FormButtons';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components/ModalConfirmBox';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
import { IUser } from '@orbital_app/common';
import { getRoles } from 'api/roles/get-roles';
import { getUserById } from 'api/users/get-user-by-id';
import { updUserState } from 'slices/authSlice';
import { useUpdateUserMutation } from 'slices/usersApiSlice';

interface IFormInput {
  name: string;
  email: string;
  role: string;
}

const schema = yup.object().shape({
  name: textField().max(80).required('Required'),
  email: textField()
    .max(40)
    .required('Required')
    .email('Invalid email address'),
  role: yup.string().required('Required'),
});

interface TPageProps {
  roles: Array<{ role: string; roleDisplay: string }>;
  user: IUser;
  error?: string[];
}

const UserEditScreen: React.FC<TPageProps> = ({ roles, user, error }) => {
  const dispatch = useDispatch();
  const [updateUser, { isLoading: updating, error: errorUpdating }] =
    useUpdateUserMutation();

  const {
    register,
    control,
    handleSubmit,
    // setValue,
    getValues,
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
    try {
      const res = await updateUser({
        id: user.id,
        name: getValues('name'),
        email: getValues('email'),
        role: getValues('role'),
      }).unwrap();
      dispatch(updUserState({ ...res }));
      toast.success('User updated');
      Router.push(PAGES.USER_LIST_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(PAGES.USER_LIST_PAGE);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(PAGES.USER_LIST_PAGE);
    }
  };

  const selectRoles = [
    { label: 'Select role', value: '' },
    ...roles.map((role) => ({ label: role.roleDisplay, value: role.role })),
  ];

  const loadingOrProcessing = updating;

  return (
    <>
      <Meta title={TITLES.TITLE_EDIT_USER} />
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <FormContainer>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>{TITLES.TITLE_EDIT_USER}</FormTitle>
          {errorUpdating && <ErrorBlock error={errorUpdating} />}
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
              <SelectField
                controlId='role'
                options={selectRoles}
                control={control}
                error={errors.role}
                setError={setError}
              />
              <FormButtonBox>
                <UpdateSubmitButton
                  disabled={loadingOrProcessing || !isDirty}
                />
                <CancelButton
                  disabled={loadingOrProcessing}
                  onClick={goBackHandler}
                />
              </FormButtonBox>
            </>
          )}
          {loadingOrProcessing && <Loader />}
        </Box>
      </FormContainer>
    </>
  );
};

// Fetch user and User Roles (to fill dropdown box)
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const roles = await getRoles(context);
    // the name of the query parameter ('edit') should match the [filename].tsx
    const id = context.query.edit as string | string[] | undefined;
    let userId = Array.isArray(id) ? id[0] : id;
    if (!userId) {
      userId = '';
    }
    let user = null;
    if (userId) {
      // Call the corresponding API function to fetch user data
      user = await getUserById(context, userId);
    }
    return {
      props: { roles, user },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { roles: [], user: {}, error: parsedError },
    };
  }
};

export default UserEditScreen;
