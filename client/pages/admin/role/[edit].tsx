import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextNumField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { textField } from 'form/ValidationSpecs';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import ModalConfirmBox from 'components/ModalConfirmBox';
import { H1_EDIT_ROLE } from 'constants/form-titles';
import { ROLE_LIST_PAGE } from 'constants/client-pages';
import { IRole } from '@orbitelco/common';
import { getRoleById } from 'api/users/get-role-by-id';
import { useUpdateRoleMutation } from 'slices/rolesApiSlice';

interface IFormInput {
  // role: string;
  roleDisplay: string;
}

const schema = yup.object().shape({
  // role: textField().required('Required'),
  roleDisplay: textField().required('Required'),
});

interface TPageProps {
  roleObj: IRole;
}

const RoleEditScreen: React.FC<TPageProps> = ({ roleObj }) => {
  const [updateRole, { isLoading: updating, error: errorUpdating }] =
    useUpdateRoleMutation();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
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
      reset();
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
      <Meta title={H1_EDIT_ROLE} />
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <FormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>{H1_EDIT_ROLE}</FormTitle>
          {errorUpdating && <ErrorBlock error={errorUpdating} />}
          <p>
            <strong>Role: </strong> {roleObj.role}
          </p>
          <TextNumField
            controlId='roleDisplay'
            label='Role Display'
            register={register}
            error={errors.roleDisplay}
            setError={setError}
          />
          <div className='d-flex mt-3 justify-content-between align-items-center'>
            <Button
              id='BUTTON_update'
              type='submit'
              variant='primary'
              disabled={loadingOrProcessing || !isDirty}>
              Update
            </Button>
            <Button
              className='btn btn-light my-3'
              onClick={goBackHandler}
              disabled={loadingOrProcessing}>
              Cancel
            </Button>
          </div>
          {updating && <Loader />}
        </Form>
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
  } catch (error) {
    // Handle errors if any
    console.error('Error fetching data:', error);
    return {
      props: { roleObj: {} },
    };
  }
};

export default RoleEditScreen;
