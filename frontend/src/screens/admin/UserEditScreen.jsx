import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import Meta from '../../components/Meta';
import ErrorMessage from '../../components/messages/ErrorMessage';
import Loader from '../../components/Loader';
import FormContainer from '../../components/formComponents/FormContainer';
import {
  FormGroupTextEdit,
  FormGroupEmailEdit,
  FormGroupCheckBox,
} from '../../components/formComponents/FormGroupControls';

import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const navigate = useNavigate();

  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate, error: errorUpdate }] =
    useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin }).unwrap();
      toast.success('user updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Meta title='Edit User' />
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <ErrorMessage error={errorUpdate} />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : (
          <Form onSubmit={submitHandler}>
            <FormGroupTextEdit
              controlId='name'
              label='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FormGroupEmailEdit
              controlId='email'
              label='Email Address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormGroupCheckBox
              controlId='isadmin'
              label='Is Admin'
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />

            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
