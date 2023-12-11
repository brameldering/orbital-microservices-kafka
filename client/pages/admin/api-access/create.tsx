import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm, Resolver } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { TextNumField, SelectField } from 'form/FormComponents';
import { textField } from 'form/ValidationSpecs';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import ModalConfirmBox from 'components/ModalConfirmBox';
import { H1_CREATE_API_ACCESS } from 'constants/form-titles';
import { API_ACCESS_LIST_PAGE } from 'constants/client-pages';
import { CURRENT_MICROSERVICES } from '@orbitelco/common';
import { getRoles } from 'api/roles/get-roles';
import { useCreateApiAccessMutation } from 'slices/apiAccessApiSlice';

interface IFormInput {
  microservice: string;
  apiName: string;
  allowedRoles: string[];
}

const schema = yup.object().shape({
  microservice: yup.string().required('Required'),
  apiName: textField().max(40).required('Required'),
  allowedRoles: yup.array().of(yup.string()),
});

interface TPageProps {
  roles: Array<{ role: string; roleDisplay: string }>;
}

const ApiAccessCreateScreen: React.FC<TPageProps> = ({ roles }) => {
  const [createApiAccess, { isLoading: creating, error: errorCreating }] =
    useCreateApiAccessMutation();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      microservice: '',
      apiName: '',
      allowedRoles: [],
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema) as Resolver<IFormInput>,
  });

  const onSubmit = async () => {
    try {
      // console.log('getValues(allowedRoles)', getValues('allowedRoles'));
      await createApiAccess({
        microservice: getValues('microservice'),
        apiName: getValues('apiName'),
        allowedRoles: getValues('allowedRoles'),
      }).unwrap();
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
  // --------------------------------------------------
  const microservices = [
    { label: 'Select microservice', value: '' },
    ...CURRENT_MICROSERVICES.map((ms) => ({
      label: ms,
      value: ms,
    })),
  ];

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
          <SelectField
            controlId='microservice'
            options={microservices}
            control={control}
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
          <fieldset className='border border-primary mt-3 mb-0'>
            <Form.Group as={Row}>
              <Form.Label as='legend' column sm={6} className='ps-3 pt-1'>
                Allowed Roles
              </Form.Label>
              <Col sm={6}>
                {roles.map((role, index) => (
                  <div key={index} className='m-1'>
                    <Form.Check
                      type='checkbox'
                      id={`checkbox-${index}`}
                      label={role.roleDisplay}
                      value={role.role}
                      {...register(`allowedRoles.${index}` as const)}
                    />
                  </div>
                ))}
              </Col>
            </Form.Group>
          </fieldset>
          {errorCreating && <ErrorBlock error={errorCreating} />}
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

// Fetch Roles (to generate list of checkboxes)
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const roles = await getRoles(context);
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

export default ApiAccessCreateScreen;
