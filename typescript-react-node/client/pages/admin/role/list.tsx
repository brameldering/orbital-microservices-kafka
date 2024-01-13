import React, { useState } from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import Link from 'next/link';
import {
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import FormTitle from 'form/FormTitle';
import FormTable from 'form/FormTable';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components//ModalConfirmBox';
import TITLES from 'constants/form-titles';
import { IRole } from '@orbital_app/common';
import PAGES from 'constants/client-pages';
import { getRoles } from 'api/roles/get-roles';
import { useDeleteRoleMutation } from 'slices/rolesApiSlice';

interface TPageProps {
  roles: IRole[];
  error?: string[];
}

const RolesListScreen: React.FC<TPageProps> = ({ roles, error }) => {
  // --------------- Delete Role ---------------
  const [deleteRole, { isLoading: deleting, error: errorDeleting }] =
    useDeleteRoleMutation();

  const [confirmDeleteRoleModal, setConfirmDeleteRoleModal] =
    useState<boolean>(false);
  const [deleteRoleId, setDeleteRoleId] = useState<string>('');

  const confirmDeleteRole = (id: string) => {
    setDeleteRoleId(id);
    setConfirmDeleteRoleModal(true);
  };
  const cancelDeleteRole = () => setConfirmDeleteRoleModal(false);

  const deleteRoleHandler = async () => {
    try {
      await deleteRole(deleteRoleId).unwrap();
      // perform a redirect to this page to refetch role records
      Router.push(PAGES.ROLE_LIST_PAGE);
    } catch (err) {
      // Do nothing because useDeleteRoleMutation will set errorDeleting in case of an error
    } finally {
      setConfirmDeleteRoleModal(false);
    }
  };
  // --------------------------------------------------

  const loadingOrProcessing = deleting;

  return (
    <>
      <Meta title={TITLES.TITLE_ROLE_ADMIN} />
      <ModalConfirmBox
        showModal={confirmDeleteRoleModal}
        title='Delete Role'
        body='Are you sure you want to delete this role?'
        handleClose={cancelDeleteRole}
        handleConfirm={deleteRoleHandler.bind(this)}
      />
      <Grid
        container
        justifyContent='space-between'
        alignItems='center'
        sx={{ mb: 2 }}>
        <Grid item>
          <FormTitle>{TITLES.TITLE_ROLE_ADMIN}</FormTitle>
        </Grid>
        <Grid item>
          <Link href={PAGES.ROLE_CREATE_PAGE} passHref>
            <Button
              id={'BUTTON_create_role'}
              variant='contained'
              startIcon={<AddIcon />}>
              {' '}
              Create Role
            </Button>
          </Link>
        </Grid>
      </Grid>
      {errorDeleting && <ErrorBlock error={errorDeleting} />}
      {error ? (
        <ErrorBlock error={error} />
      ) : (
        <>
          {roles?.length === 0 ? (
            <Typography>There are no roles</Typography>
          ) : (
            <FormTable>
              <TableHead>
                <TableRow>
                  <TableCell>ROLE</TableCell>
                  <TableCell>ROLE DISPLAY</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roles.map((role: any) => (
                  <TableRow key={role.id}>
                    <TableCell id={`role_${role.role}`}>{role.role}</TableCell>
                    <TableCell id={`roleDisplay_${role.role}`}>
                      {role.roleDisplay}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`${PAGES.ROLE_EDIT_PAGE}/${role.id}`}
                        style={{ marginRight: '10px' }}>
                        <Button
                          variant='outlined'
                          size='small'
                          startIcon={<EditIcon />}
                          sx={{ mx: 1 }}></Button>
                      </Link>
                      <Button
                        id={`delete_${role.role}`}
                        variant='contained'
                        color='error'
                        size='small'
                        startIcon={<DeleteIcon />}
                        onClick={() => confirmDeleteRole(role.id)}></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </FormTable>
          )}
          {loadingOrProcessing && <Loader />}
        </>
      )}
    </>
  );
};

// Fetch Roles
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

export default RolesListScreen;
