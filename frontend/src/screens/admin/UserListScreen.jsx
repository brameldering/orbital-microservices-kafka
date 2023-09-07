import { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import { ErrorMessage } from '../../components/general/Messages';
import ModalConfirmBox from '../../components/general/ModalConfirmBox';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from '../../slices/usersApiSlice';

const UserListScreen = () => {
  // --------------- Get Users ---------------
  const { data: users, refetch, isLoading, errorLoading } = useGetUsersQuery();

  // --------------- Delete User ---------------
  const [deleteUser, { isLoading: loadingDelete, error: errorDelete }] =
    useDeleteUserMutation();

  const [confirmDeleteUserModal, setConfirmDeleteUserModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState();

  const confirmDeleteUser = (id) => {
    setDeleteUserId(id);
    setConfirmDeleteUserModal(true);
  };
  const cancelDeleteUser = () => setConfirmDeleteUserModal(false);

  const deleteUserHandler = async () => {
    try {
      await deleteUser(deleteUserId).unwrap();
      refetch();
    } catch (err) {
      // Do nothing because the error will be displayed as ErrorMessage
      // toast.error(err?.data?.message || err.error);
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
      {errorDelete && <ErrorMessage error={errorDelete} />}
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorMessage error={errorLoading} />
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
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer
                    to={`/admin/user/${user._id}/edit`}
                    style={{ marginRight: '10px' }}
                  >
                    <Button variant='light' className='btn-sm'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => confirmDeleteUser(user._id)}
                  >
                    <FaTrash style={{ color: 'white' }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {loadingDelete && <Loader />}
    </>
  );
};

export default UserListScreen;
