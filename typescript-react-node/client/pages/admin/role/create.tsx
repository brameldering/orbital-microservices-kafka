import React, { useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import { TextNumField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { textField } from 'form/ValidationSpecs';
import FormButtonBox from 'form/FormButtonBox';
import { CreateSubmitButton, CancelButton } from 'form/FormButtons';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import ModalConfirmBox from 'components/ModalConfirmBox';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
import { useCreateRoleMutation } from 'slices/rolesApiSlice';

interface IFormInput {
  role: string;
  roleDisplay: string;
}

const schema = yup.object().shape({
  role: textField().max(25).required('Required'),
  roleDisplay: textField().max(25).required('Required'),
});

const RoleCreateScreen: React.FC = () => {
  const [createRole, { isLoading: creating, error: errorCreating }] =
    useCreateRoleMutation();

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      role: '',
      roleDisplay: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    try {
      await createRole({
        role: getValues('role'),
        roleDisplay: getValues('roleDisplay'),
      }).unwrap();
      toast.success('Role created');
      Router.push(PAGES.ROLE_LIST_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(PAGES.ROLE_LIST_PAGE);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(PAGES.ROLE_LIST_PAGE);
    }
  };

  const loadingOrProcessing = creating;

  return (
    <>
      <Meta title={TITLES.TITLE_CREATE_ROLE} />
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
          <FormTitle>{TITLES.TITLE_CREATE_ROLE}</FormTitle>
          {errorCreating && <ErrorBlock error={errorCreating} />}
          <TextNumField
            controlId='role'
            label='Role'
            register={register}
            error={errors.role}
            setError={setError}
          />
          <TextNumField
            controlId='roleDisplay'
            label='Role Display'
            register={register}
            error={errors.roleDisplay}
            setError={setError}
          />
          <FormButtonBox>
            <CancelButton
              disabled={loadingOrProcessing}
              onClick={goBackHandler}
            />
            <CreateSubmitButton disabled={loadingOrProcessing || !isDirty} />
          </FormButtonBox>
          {loadingOrProcessing && <Loader />}
        </Box>
      </FormContainer>
    </>
  );
};

export default RoleCreateScreen;
