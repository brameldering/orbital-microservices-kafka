import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
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
import { H1_CREATE_API_ACCESS } from 'constants/form-titles';
import { API_ACCESS_LIST_PAGE } from 'constants/client-pages';
import { useCreateApiAccessMutation } from 'slices/apiAccessApiSlice';

interface IFormInput {
  microservice: string;
  apiName: string;
  allowedRoles: string[];
}

const schema = yup.object().shape({
  microservice: textField().required('Required'),
  apiName: textField().max(40).required('Required'),
});

const ApiAccessCreateScreen: React.FC = () => {
  const [createApiAccess, { isLoading: creating, error: errorCreating }] =
    useCreateApiAccessMutation();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      microservice: '',
      apiName: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    try {
      await createApiAccess({
        microservice: getValues('microservice'),
        apiName: getValues('apiName'),
        allowedRoles: getValues('allowedRoles'),
      }).unwrap();
      reset();
      toast.success('Api Access created');
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

  const loadingOrProcessing = creating;

  return (
    <>
      <Meta title={H1_CREATE_API_ACCESS} />
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <FormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>{H1_CREATE_API_ACCESS}</FormTitle>
          {errorCreating && <ErrorBlock error={errorCreating} />}
          <TextNumField
            controlId='microservice'
            label='Microservice'
            register={register}
            error={errors.microservice}
            setError={setError}
          />
          <TextNumField
            controlId='apiName'
            label='API Name'
            register={register}
            error={errors.apiName}
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
          {loadingOrProcessing && <Loader />}
        </Form>
      </FormContainer>
    </>
  );
};

export default ApiAccessCreateScreen;
