import React, { useState } from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm, Resolver, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { TextNumField, SelectField } from 'form/FormComponents';
import { textFieldNoSpaces } from 'form/ValidationSpecs';
import FormButtonBox from 'form/FormButtonBox';
import { CreateSubmitButton, CancelButton } from 'form/FormButtons';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components/ModalConfirmBox';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
import { CURRENT_MICROSERVICES } from '@orbital_app/common';
import { getRoles } from 'api/roles/get-roles';
import { useCreateApiAccessMutation } from 'slices/apiAccessApiSlice';

interface IFormInput {
  apiName: string;
  microservice: string;
  allowedRoles: string[];
}

const schema = yup.object().shape({
  apiName: textFieldNoSpaces().max(40).required('Required'),
  microservice: yup.string().required('Required'),
  allowedRoles: yup.array().of(yup.string()),
});

interface TPageProps {
  roles: Array<{ role: string; roleDisplay: string }>;
  error?: string[];
}

const ApiAccessCreateScreen: React.FC<TPageProps> = ({ roles, error }) => {
  const [createApiAccess, { isLoading: creating, error: errorCreating }] =
    useCreateApiAccessMutation();

  const {
    register,
    control,
    getValues,
    handleSubmit,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      apiName: '',
      microservice: '',
      allowedRoles: [],
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema) as Resolver<IFormInput>,
  });

  const onSubmit = async () => {
    try {
      // Extract array of role name strings based on order
      // of false/undefined and true in getValues('allowedRoles') array
      const allowedRoles: string[] = [];
      let index = 0;
      roles.forEach((roleObj) => {
        if (getValues('allowedRoles')[index]) {
          allowedRoles.push(roleObj.role);
        }
        index++;
      });
      await createApiAccess({
        apiName: getValues('apiName'),
        microservice: getValues('microservice'),
        allowedRoles: allowedRoles,
      }).unwrap();
      toast.success('Api Access created');
      Router.push(PAGES.API_ACCESS_LIST_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(PAGES.API_ACCESS_LIST_PAGE);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(PAGES.API_ACCESS_LIST_PAGE);
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
      <Meta title={TITLES.TITLE_CREATE_API_ACCESS} />
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <FormContainer>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>{TITLES.TITLE_CREATE_API_ACCESS}</FormTitle>
          {error ? (
            <ErrorBlock error={error} />
          ) : (
            <>
              <TextNumField
                controlId='apiName'
                label='API Name'
                register={register}
                error={errors.apiName}
                setError={setError}
              />
              <SelectField
                controlId='microservice'
                options={microservices}
                control={control}
                error={errors.microservice}
                setError={setError}
              />
              <FormControl
                component='fieldset'
                variant='outlined'
                margin='normal'>
                <FormLabel component='legend'>Allowed Roles</FormLabel>
                <FormGroup>
                  <Grid container spacing={2}>
                    {roles.map((role, index) => (
                      <Grid item xs={12} sm={6} key={role.role}>
                        <FormControlLabel
                          control={
                            <Controller
                              name={`allowedRoles.${index}`}
                              control={control}
                              render={({ field }) => (
                                <Checkbox {...field} value={role.role} />
                              )}
                            />
                          }
                          label={role.roleDisplay}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </FormControl>
              {errorCreating && <ErrorBlock error={errorCreating} />}
              <FormButtonBox>
                <CreateSubmitButton
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

// Fetch Roles (to generate list of checkboxes)
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const roles = await getRoles(context);
    return {
      props: { roles },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { roles: [], error: parsedError },
    };
  }
};

export default ApiAccessCreateScreen;
