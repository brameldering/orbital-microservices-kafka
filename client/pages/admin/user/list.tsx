import React, { useState } from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import Link from 'next/link';
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import FormTitle from 'form/FormTitle';
import FormTable from 'form/FormTable';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components//ModalConfirmBox';
import { TITLE_USER_ADMIN } from 'constants/form-titles';
import { ADMIN_ROLE, IUser } from '@orbitelco/common';
import { USER_EDIT_PAGE, USER_LIST_PAGE } from 'constants/client-pages';
import { getUsers } from 'api/users/get-users';
import { useDeleteUserMutation } from 'slices/usersApiSlice';

interface TPageProps {
  users: IUser[];
  error?: string[];
}

const UserListScreen: React.FC<TPageProps> = ({ users, error }) => {
  // --------------- Delete User ---------------
  const [deleteUser, { isLoading: deleting, error: errorDeleting }] =
    useDeleteUserMutation();

  const [confirmDeleteUserModal, setConfirmDeleteUserModal] =
    useState<boolean>(false);
  const [deleteUserId, setDeleteUserId] = useState<string>('');

  const confirmDeleteUser = (id: string) => {
    setDeleteUserId(id);
    setConfirmDeleteUserModal(true);
  };
  const cancelDeleteUser = () => setConfirmDeleteUserModal(false);

  const deleteUserHandler = async () => {
    try {
      await deleteUser(deleteUserId).unwrap();
      // perform a redirect to this page to refetch user records
      Router.push(USER_LIST_PAGE);
    } catch (err) {
      // Do nothing because useDeleteUserMutation will set errorDeleting in case of an error
    } finally {
      setConfirmDeleteUserModal(false);
    }
  };
  // --------------------------------------------------
  const loadingOrProcessing = deleting;

  return (
    <>
      <Meta title={TITLE_USER_ADMIN} />
      <ModalConfirmBox
        showModal={confirmDeleteUserModal}
        title='Delete User'
        body='Are you sure you want to delete this user?'
        handleClose={cancelDeleteUser}
        handleConfirm={deleteUserHandler.bind(this)}
      />
      <FormTitle>{TITLE_USER_ADMIN}</FormTitle>
      {errorDeleting && <ErrorBlock error={errorDeleting} />}
      {/* {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorBlock error={errorLoading} />
      ) : */}
      {error ? (
        <ErrorBlock error={error} />
      ) : users?.length === 0 ? (
        <p>There are no users</p>
      ) : (
        <FormTable>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>NAME</TableCell>
              <TableCell>EMAIL</TableCell>
              <TableCell>ADMIN</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell id={`id_${user.email}`}>{user.id}</TableCell>
                  <TableCell id={`name_${user.email}`}>{user.name}</TableCell>
                  <TableCell id={`email_${user.email}`}>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </TableCell>
                  <TableCell id={`admin_${user.email}`}>
                    {user.role === ADMIN_ROLE ? (
                      <CheckIcon style={{ color: 'green' }} />
                    ) : (
                      <CloseIcon style={{ color: 'red' }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      id={`edit_${user.email}`}
                      href={`${USER_EDIT_PAGE}/${user.id}`}
                      passHref>
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </Link>
                    <IconButton
                      id={`delete_${user.email}`}
                      onClick={() => confirmDeleteUser(user.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </FormTable>
      )}
      {loadingOrProcessing && <Loader />}
    </>
  );
};

// Fetch Users
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const users = await getUsers(context);
    return {
      props: { users },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { users: [], error: parsedError },
    };
  }
};

export default UserListScreen;
