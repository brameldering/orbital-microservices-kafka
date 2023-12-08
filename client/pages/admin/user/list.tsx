import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { NextPageContext } from 'next';
import Router from 'next/router';
import Link from 'next/link';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import ModalConfirmBox from 'components//ModalConfirmBox';
import { H1_USER_ADMIN } from 'constants/form-titles';
import { ADMIN_ROLE, IUser } from '@orbitelco/common';
import { USER_EDIT_PAGE, USER_LIST_PAGE } from 'constants/client-pages';
import { getUsers } from 'api/users/get-users';
import { useDeleteUserMutation } from 'slices/usersApiSlice';

interface TPageProps {
  users: IUser[];
}

const UserListScreen: React.FC<TPageProps> = ({ users }) => {
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
  return (
    <>
      <Meta title={H1_USER_ADMIN} />
      <ModalConfirmBox
        showModal={confirmDeleteUserModal}
        title='Delete User'
        body='Are you sure you want to delete this user?'
        handleClose={cancelDeleteUser}
        handleConfirm={deleteUserHandler.bind(this)}
      />
      <h1>{H1_USER_ADMIN}</h1>
      {errorDeleting && <ErrorBlock error={errorDeleting} />}
      {/* {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorBlock error={errorLoading} />
      ) : */}
      {users?.length === 0 ? (
        <p>There are no users</p>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => (
                <tr key={user.id}>
                  <td id={`id_${user.email}`}>{user.id}</td>
                  <td id={`name_${user.email}`}>{user.name}</td>
                  <td id={`email_${user.email}`}>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td id={`admin_${user.email}`}>
                    {user.role === ADMIN_ROLE ? (
                      <FaCheck style={{ color: 'green' }} />
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    <Link
                      href={`${USER_EDIT_PAGE}/${user.id}`}
                      style={{ marginRight: '10px' }}>
                      <Button
                        id={`edit_${user.email}`}
                        variant='light'
                        className='btn-sm'>
                        <FaEdit />
                      </Button>
                    </Link>
                    <Button
                      id={`delete_${user.email}`}
                      variant='danger'
                      className='btn-sm'
                      onClick={() => confirmDeleteUser(user.id)}>
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
      {deleting && <Loader />}
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
  } catch (error) {
    // Handle errors if any
    console.error('Error fetching data:', error);
    return {
      props: { users: [] },
    };
  }
};

export default UserListScreen;
