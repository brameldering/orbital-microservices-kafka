import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';

import ErrorMessage from '../../components/general/ErrorMessage';
import Loader from '../../components/general/Loader';
import Meta from '../../components/general/Meta';
import ModalConfirmBox from '../../components/general/ModalConfirmBox';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '../../slices/usersApiSlice';

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
      <h1>Users</h1>
      {errorDeleting && <ErrorMessage error={errorDeleting} />}
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorMessage error={errorLoading} />
      ) : users && users.length === 0 ? (
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
                <tr key={user._id}>
                  <td id={`id_${user.email}`}>{user._id}</td>
                  <td id={`name_${user.email}`}>{user.name}</td>
                  <td id={`email_${user.email}`}>
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>
                  <td id={`admin_${user.email}`}>
                    {user.isAdmin ? (
                      <FaCheck style={{ color: 'green' }} />
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer
                      to={`/admin/user/${user._id}/edit`}
                      style={{ marginRight: '10px' }}>
                      <Button
                        id={`edit_${user.email}`}
                        variant='light'
                        className='btn-sm'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      id={`delete_${user.email}`}
                      variant='danger'
                      className='btn-sm'
                      onClick={() => confirmDeleteUser(user._id)}>
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
