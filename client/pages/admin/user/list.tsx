import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import ModalConfirmBox from 'components//ModalConfirmBox';
import { ADMIN_ROLE } from '@orbitelco/common';
import { USER_EDIT_PAGE } from 'constants/client-pages';
import { useGetUsersQuery, useDeleteUserMutation } from 'slices/usersApiSlice';

const UserListScreen = () => {
  // --------------- Get Users ---------------
  const {
    data: users,
    refetch,
    isLoading,
    error: errorLoading,
  } = useGetUsersQuery();

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
      refetch();
    } catch (err) {
      // Do nothing because useDeleteUserMutation will set errorDeleting in case of an error
    } finally {
      setConfirmDeleteUserModal(false);
    }
  };

  // --------------------------------------------
  return (
    <>
      <Meta title='Manage Users' />
      <ModalConfirmBox
        showModal={confirmDeleteUserModal}
        title='Delete User'
        body='Are you sure you want to delete this user?'
        handleClose={cancelDeleteUser}
        handleConfirm={deleteUserHandler.bind(this)}
      />
      <h1>User Admin</h1>
      {errorDeleting && <ErrorBlock error={errorDeleting} />}
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorBlock error={errorLoading} />
      ) : users?.length === 0 ? (
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

export default UserListScreen;
