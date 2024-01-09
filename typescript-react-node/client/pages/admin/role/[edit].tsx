import React, { useState } from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Typography } from '@mui/material';
import { TextNumField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { textField } from 'form/ValidationSpecs';
import { UpdateSubmitButton, CancelButton } from 'form/FormButtons';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components/ModalConfirmBox';
import { TITLE_EDIT_ROLE } from 'constants/form-titles';
import { ROLE_LIST_PAGE } from 'constants/client-pages';
import { IRole } from '@orbitelco/common';
import { getRoleById } from 'api/roles/get-role-by-id';
import { useUpdateRoleMutation } from 'slices/rolesApiSlice';

interface IFormInput {
  // role: string;
  roleDisplay: string;
}

const schema = yup.object().shape({
  // role: textField().required('Required'),
  roleDisplay: textField().max(25).required('Required'),
});

interface TPageProps {
  roleObj: IRole;
  error?: string[];
}

const RoleEditScreen: React.FC<TPageProps> = ({ roleObj, error }) => {
  const [updateRole, { isLoading: updating, error: errorUpdating }] =
    useUpdateRoleMutation();

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      roleDisplay: roleObj?.roleDisplay || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    try {
      await updateRole({
        id: roleObj.id,
        role: roleObj?.role,
        roleDisplay: getValues('roleDisplay'),
      }).unwrap();
      toast.success('Role updated');
      Router.push(ROLE_LIST_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(ROLE_LIST_PAGE);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(ROLE_LIST_PAGE);
    }
  };

  const loadingOrProcessing = updating;

  return (
    <>
      <Meta title={TITLE_EDIT_ROLE} />
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <FormContainer>
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}>
          <FormTitle>{TITLE_EDIT_ROLE}</FormTitle>
          {errorUpdating && <ErrorBlock error={errorUpdating} />}
          {error ? (
            <ErrorBlock error={error} />
          ) : (
            <>
              <Typography>
                <strong>Role: </strong> {roleObj.role}
              </Typography>
              <TextNumField
                controlId='roleDisplay'
                label='Role Display'
                register={register}
                error={errors.roleDisplay}
                setError={setError}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 3,
                  mb: 2,
                }}>
                <UpdateSubmitButton
                  disabled={loadingOrProcessing || !isDirty}
                />
                <CancelButton
                  disabled={loadingOrProcessing}
                  onClick={goBackHandler}
                />
              </Box>
            </>
          )}
          {loadingOrProcessing && <Loader />}
        </Box>
      </FormContainer>
    </>
  );
};

// Fetch role
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    // the name of the query parameter ('edit') should match the [filename].tsx
    const id = context.query.edit as string | string[] | undefined;
    let roleId = Array.isArray(id) ? id[0] : id;
    if (!roleId) {
      roleId = '';
    }
    let roleObj = null;
    if (roleId) {
      // Call the corresponding API function to fetch role data
      roleObj = await getRoleById(context, roleId);
    }
    return {
      props: { roleObj },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { roleObj: {}, error: parsedError },
    };
  }
};

export default RoleEditScreen;
