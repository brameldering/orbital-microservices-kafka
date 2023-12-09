import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { TextNumField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import ModalConfirmBox from 'components/ModalConfirmBox';
import { H1_EDIT_API_ACCESS } from 'constants/form-titles';
import { API_ACCESS_LIST_PAGE } from 'constants/client-pages';
import { IApiAccess } from '@orbitelco/common';
import { getApiAccessById } from 'api/api-access/get-api-access-by-id';
import { useUpdateApiAccessMutation } from 'slices/apiAccessApiSlice';

interface IFormInput {
  // role: string;
  allowedRoles: string[];
}

interface TPageProps {
  apiAccess: IApiAccess;
}

const ApiAccessEditScreen: React.FC<TPageProps> = ({ apiAccess }) => {
  const [updateApiAccess, { isLoading: updating, error: errorUpdating }] =
    useUpdateApiAccessMutation();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      allowedRoles: apiAccess?.allowedRoles || [''],
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
  });

  const onSubmit = async () => {
    try {
      await updateApiAccess({
        microservice: apiAccess.microservice,
        apiName: apiAccess.apiName,
        allowedRoles: getValues('allowedRoles'),
      }).unwrap();
      reset();
      toast.success('Role updated');
      Router.push(API_ACCESS_LIST_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(API_ACCESS_LIST_PAGE);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(API_ACCESS_LIST_PAGE);
    }
  };

  const loadingOrProcessing = updating;

  return (
    <>
      <Meta title={H1_EDIT_API_ACCESS} />
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <FormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>{H1_EDIT_API_ACCESS}</FormTitle>
          {errorUpdating && <ErrorBlock error={errorUpdating} />}
          <p>
            <strong>Microservice: </strong> {apiAccess.microservice}
          </p>
          <p>
            <strong>Api Name: </strong> {apiAccess.apiName}
          </p>
          <TextNumField
            controlId='allowedRoles'
            label='Allowed Roles'
            register={register}
            error={errors.allowedRoles}
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
    let apiAccessId = Array.isArray(id) ? id[0] : id;
    if (!apiAccessId) {
      apiAccessId = '';
    }
    let apiAccess = null;
    if (apiAccessId) {
      // Call the corresponding API function to fetch api access data
      apiAccess = await getApiAccessById(context, apiAccessId);
    }
    return {
      props: { apiAccess },
    };
  } catch (error) {
    // Handle errors if any
    console.error('Error fetching data:', error);
    return {
      props: { apiAccess: {} },
    };
  }
};

export default ApiAccessEditScreen;
