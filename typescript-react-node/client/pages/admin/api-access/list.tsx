import React, { useState } from 'react';
import { NextPageContext } from 'next';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Grid,
  Button,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import FormTitle from 'form/FormTitle';
import FormTable from 'form/FormTable';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components//ModalConfirmBox';
import { TITLE_API_ACCESS_ADMIN } from 'constants/form-titles';
import {
  IApiAccess,
  CURRENT_MICROSERVICES,
  MICROSERVICE_AUTH,
} from '@orbitelco/common';
import {
  API_ACCESS_LIST_PAGE,
  API_ACCESS_CREATE_PAGE,
  API_ACCESS_EDIT_PAGE,
} from 'constants/client-pages';
import { getRoles } from 'api/roles/get-roles';
import { getApiAccessList } from 'api/api-access/get-api-access-list';
import { useDeleteApiAccessMutation } from 'slices/apiAccessApiSlice';

interface TPageProps {
  roles: Array<{ role: string; roleDisplay: string }>;
  apiAccess: IApiAccess[];
  error?: string[];
}

const ApiAccessListscreen: React.FC<TPageProps> = ({
  roles,
  apiAccess,
  error,
}) => {
  // --------------- Delete Api Access ---------------
  const [deleteApiAccess, { isLoading: deleting, error: errorDeleting }] =
    useDeleteApiAccessMutation();

  const [confirmDeleteApiAccessModal, setConfirmDeleteApiAccessModal] =
    useState<boolean>(false);
  const [deleteApiAccessId, setDeleteApiAccessId] = useState<string>('');

  const confirmDeleteApiAccess = (id: string) => {
    setDeleteApiAccessId(id);
    setConfirmDeleteApiAccessModal(true);
  };
  const cancelDeleteApiAccess = () => setConfirmDeleteApiAccessModal(false);

  const deleteApiAccessHandler = async () => {
    try {
      await deleteApiAccess(deleteApiAccessId).unwrap();
      // perform a redirect to this page to refetch apiAccess records
      Router.push(API_ACCESS_LIST_PAGE);
    } catch (err) {
      // Do nothing because useDeleteApiAccessMutation will set errorDeleting in case of an error
    } finally {
      setConfirmDeleteApiAccessModal(false);
    }
  };
  // --------------------------------------------------
  const router = useRouter();
  let selectedMicroservice = router.query.selected as string | undefined;
  if (!selectedMicroservice) {
    selectedMicroservice = MICROSERVICE_AUTH;
  }
  const handleSelectChange = (event: any) => {
    const value = event.target.value;
    // Reload the page with the selected value as a query parameter
    Router.push(`${API_ACCESS_LIST_PAGE}/?selected=${value}`, undefined, {
      shallow: true,
    });
  };

  const microservices = CURRENT_MICROSERVICES.map((ms) => ({
    label: ms,
    value: ms,
  }));

  // --------------------------------------------------
  const isRoleAllowed = (role: string, allowedRoles: string[]) => {
    return allowedRoles.includes(role);
  };

  // --------------------------------------------------
  const loadingOrProcessing = deleting;

  return (
    <>
      <Meta title={TITLE_API_ACCESS_ADMIN} />
      <ModalConfirmBox
        showModal={confirmDeleteApiAccessModal}
        title='Delete Api Access'
        body='Are you sure you want to delete this Api Access?'
        handleClose={cancelDeleteApiAccess}
        handleConfirm={deleteApiAccessHandler.bind(this)}
      />
      <Grid container alignItems='center' spacing={2}>
        <Grid item xs>
          <FormTitle>{TITLE_API_ACCESS_ADMIN}</FormTitle>
        </Grid>
        <Grid item>
          <Link href={API_ACCESS_CREATE_PAGE} passHref>
            <Button
              id='BUTTON_create_apiAccess'
              variant='contained'
              startIcon={<AddIcon />}>
              Create Api Access
            </Button>
          </Link>
        </Grid>
      </Grid>
      {error ? (
        <ErrorBlock error={error} />
      ) : (
        <>
          <FormControl fullWidth margin='normal'>
            <InputLabel id='microservice-label'>Microservice</InputLabel>
            <Select
              labelId='microservice-label'
              value={selectedMicroservice}
              variant='outlined'
              fullWidth
              onChange={handleSelectChange}
              label='Microservice'>
              {microservices.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {errorDeleting && <ErrorBlock error={errorDeleting} />}
          {apiAccess?.length === 0 ? (
            <p>There are no Api Access records</p>
          ) : (
            <FormTable>
              <TableHead>
                <TableRow>
                  <TableCell>API NAME</TableCell>
                  <TableCell>ALLOWED ROLES</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apiAccess &&
                  apiAccess
                    // Filter the records based on selected microservice
                    .filter(
                      (apiAccess: any) =>
                        apiAccess.microservice === selectedMicroservice
                    )
                    .map((filteredApiAccess: any) => (
                      <TableRow key={filteredApiAccess.id}>
                        {/* <TableCell id={`microservice_${filteredApiAccess.apiName}`}>
                      {filteredApiAccess.microservice}
                    </TableCell> */}
                        <TableCell id={`apiName_${filteredApiAccess.apiName}`}>
                          {filteredApiAccess.apiName}
                        </TableCell>
                        <TableCell
                          id={`allowedRoles_${filteredApiAccess.apiName}`}>
                          <Box
                            component='ul'
                            sx={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {roles.map((roleObj) => {
                              const { role, roleDisplay } = roleObj;
                              const isAllowed = isRoleAllowed(
                                role,
                                filteredApiAccess.allowedRoles
                              );
                              return (
                                <Box
                                  component='li'
                                  key={role}
                                  sx={{
                                    display: 'block',
                                    textAlign: 'left',
                                  }}>
                                  {isAllowed ? (
                                    <span
                                      style={{
                                        display: 'block',
                                        textAlign: 'left',
                                      }}>
                                      <CheckIcon sx={{ color: 'green' }} />{' '}
                                      {roleDisplay}
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        display: 'block',
                                        textAlign: 'left',
                                      }}>
                                      <CloseIcon sx={{ color: 'red' }} />{' '}
                                      {roleDisplay}
                                    </span>
                                  )}
                                </Box>
                              );
                            })}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Link
                            id={`edit_${filteredApiAccess.apiName}`}
                            href={`${API_ACCESS_EDIT_PAGE}/${filteredApiAccess.id}`}
                            passHref>
                            <IconButton>
                              <EditIcon />
                            </IconButton>
                          </Link>
                          <IconButton
                            id={`delete_${filteredApiAccess.apiName}`}
                            onClick={() =>
                              confirmDeleteApiAccess(filteredApiAccess.id)
                            }>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </FormTable>
          )}
        </>
      )}
      {loadingOrProcessing && <Loader />}
    </>
  );
};

// Fetch ApiAccess
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const roles = await getRoles(context);
    const apiAccess = await getApiAccessList(context);
    return {
      props: { roles, apiAccess },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { roles: [], apiAccess: [], error: parsedError },
    };
  }
};

export default ApiAccessListscreen;
