import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { textField } from '../../components/form/ValidationSpecs';
import FormContainer from '../../components/form/FormContainer';
import {
  TextField,
  EmailField,
  CheckBoxField,
} from '../../components/form/FormComponents';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import { ErrorMessage } from '../../components/general/Messages';
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from '../../slices/usersApiSlice';

const UserEditScreen = () => {
  const navigate = useNavigate();

  const { id: userId } = useParams();

  const {
    data: user,
    isLoading,
    error: errorLoading,
    refetch,
  } = useGetUserDetailsQuery(userId);

  const [updateUser, { isLoading: loadingUpdate, error: errorUpdate }] =
    useUpdateUserMutation();

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      isAdmin: user?.isAdmin || false,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: textField().required('required'),
      email: textField().required('required').email('Invalid email address'),
    }),
    onSubmit: async (values) => {
      const name = values.name;
      const email = values.email;
      const isAdmin = values.isAdmin;
      try {
        await updateUser({ userId, name, email, isAdmin }).unwrap();
        toast.success('user updated successfully');
        refetch();
        navigate('/admin/userlist');
      } catch (err) {
        // Do nothing because the error will be displayed as ErrorMessage
        // toast.error(err?.data?.message || err.error);
      }
    },
  });

  const disableSubmit = isLoading || loadingUpdate;

  return (
    <>
      <Meta title='Edit User' />
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {errorUpdate && <ErrorMessage error={errorUpdate} />}
        {isLoading ? (
          <Loader />
        ) : errorLoading ? (
          <ErrorMessage error={errorLoading} />
        ) : (
          <Form onSubmit={formik.handleSubmit}>
            <TextField controlId='name' label='Full name' formik={formik} />
            <EmailField controlId='email' label='Email' formik={formik} />
            <CheckBoxField
              controlId='isAdmin'
              label='Is Admin'
              formik={formik}
            />
            <Button
              type='submit'
              variant='primary'
              className='mt-2'
              disabled={disableSubmit}
            >
              Update
            </Button>
            {loadingUpdate && <Loader />}
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
