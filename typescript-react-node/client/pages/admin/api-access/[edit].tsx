import React, { useState, useEffect } from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm, Resolver, Controller } from 'react-hook-form';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import FormButtonBox from 'form/FormButtonBox';
import { UpdateSubmitButton, CancelButton } from 'form/FormButtons';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components/ModalConfirmBox';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
import { IApiAccess } from '@orbital_app/common';
import { getRoles } from 'api/roles/get-roles';
import { getApiAccessById } from 'api/api-access/get-api-access-by-id';
import { useUpdateApiAccessMutation } from 'slices/apiAccessApiSlice';

interface IFormInput {
  allowedRoles: string[];
}

const schema = yup.object().shape({
  allowedRoles: yup.array().of(yup.string()),
});

interface TPageProps {
  roles: Array<{ role: string; roleDisplay: string }>;
  apiAccess: IApiAccess;
  error?: string[];
}

const ApiAccessEditScreen: React.FC<TPageProps> = ({
  roles,
  apiAccess,
  error,
}) => {
  const [updateApiAccess, { isLoading: updating, error: errorUpdating }] =
    useUpdateApiAccessMutation();

  // State to store checked status of checkboxes
  const [checkedBoxes, setCheckedBoxes] = useState<boolean[]>(
    roles.map(() => false) // Initialize all checkboxes as unchecked
  );

  // On start-up assign values of apiAccess.allowedRoles
  useEffect(() => {
    if (apiAccess) {
      // Populate checked status based on apiAccess.allowedRoles
      const initialChecked = roles.map((role) =>
        apiAccess.allowedRoles.includes(role.role)
      );
      setCheckedBoxes(initialChecked);
    }
  }, [apiAccess, roles]);

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<IFormInput>({
    defaultValues: {
      allowedRoles: [],
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema) as Resolver<IFormInput>,
  });

  const onSubmit = async () => {
    const allowedRoles: string[] = [];
    let index = 0;
    roles.forEach((roleObj) => {
      if (checkedBoxes[index]) {
        allowedRoles.push(roleObj.role);
      }
      index++;
    });
    try {
      await updateApiAccess({
        id: apiAccess.id,
        apiName: apiAccess.apiName,
        microservice: apiAccess.microservice,
        allowedRoles: allowedRoles,
      }).unwrap();
      toast.success('Api Access updated');
      Router.push(PAGES.API_ACCESS_LIST_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  // --------------------------------------------------
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

  // -------------------------------------------------
  const handleCheckboxChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedChecked = [...checkedBoxes];
      updatedChecked[index] = e.target.checked;
      setCheckedBoxes(updatedChecked);
    };
  // --------------------------------------------------

  return (
    <>
      <Meta title={TITLES.TITLE_EDIT_API_ACCESS} />
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <FormContainer>
        <Box component='form' onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>{TITLES.TITLE_EDIT_API_ACCESS}</FormTitle>
          {errorUpdating && <ErrorBlock error={errorUpdating} />}
          {error ? (
            <ErrorBlock error={error} />
          ) : (
            <>
              <Typography>
                <strong>Api Name: </strong> {apiAccess.apiName}
              </Typography>
              <Typography>
                <strong>Microservice: </strong> {apiAccess.microservice}
              </Typography>
              {/* <fieldset className='border border-primary mt-3 mb-0'> */}
              <FormControl
                component='fieldset'
                variant='outlined'
                margin='normal'
                sx={{
                  border: '1px solid #ccc', // Customize the color and width as needed
                  borderRadius: '4px', // Adjust the border radius as desired
                  padding: '1em', // Add some padding inside the border
                  marginTop: '1em', // Optional: Add margin for spacing outside the border
                }}>
                <FormLabel component='legend'>Allowed Roles</FormLabel>
                <FormGroup>
                  <Grid container spacing={1}>
                    {roles.map((role, index) => (
                      <Grid item xs={12} key={role.role}>
                        <Controller
                          name={`allowedRoles.${index}`}
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  checked={checkedBoxes[index]}
                                  onChange={(e) => {
                                    handleCheckboxChange(index)(e);
                                    field.onChange(e.target.checked);
                                  }}
                                />
                              }
                              label={role.roleDisplay}
                            />
                          )}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </FormControl>
              <FormButtonBox>
                <CancelButton disabled={updating} onClick={goBackHandler} />
                <UpdateSubmitButton disabled={updating || !isDirty} />
              </FormButtonBox>
            </>
          )}
          {updating && <Loader />}
        </Box>
      </FormContainer>
    </>
  );
};

// Fetch role
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const roles = await getRoles(context);
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
      props: { roles, apiAccess },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { roles: [], apiAccess: {}, error: parsedError },
    };
  }
};

export default ApiAccessEditScreen;
