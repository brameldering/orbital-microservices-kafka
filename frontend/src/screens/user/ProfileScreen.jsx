import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  textField,
  passwordField,
} from '../../components/form/ValidationSpecs';
import FormContainer from '../../components/form/FormContainer';
import {
  TextField,
  EmailField,
  PasswordField,
} from '../../components/form/FormComponents';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import { ErrorMessage } from '../../components/general/Messages';
import { setCredentials } from '../../slices/authSlice';
import { useUpdateProfileMutation } from '../../slices/usersApiSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [
    updateProfile,
    { isLoading: loadingUpdateProfile, error: errorUpdate },
  ] = useUpdateProfileMutation();

  const formik = useFormik({
    initialValues: {
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      password: '',
      passwordConfirmation: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: textField().required('required'),
      email: textField().required('required').email('Invalid email address'),
      password: passwordField(),
      passwordConfirmation: passwordField().oneOf(
        [Yup.ref('password'), null],
        'Passwords must match'
      ),
    }),
    onSubmit: async (values) => {
      const name = values.name;
      const email = values.email;
      const password = values.password;
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
      } catch (err) {
        // Do nothing because useUpdateProfileMutation will set errorUpdate in case of an error
      }
    },
  });

  const buttonDisabled = loadingUpdateProfile;

  return (
    <FormContainer>
      <Meta title='My Profile' />
      <h1>My Profile</h1>
      {errorUpdate && <ErrorMessage error={errorUpdate} />}
      <Form onSubmit={formik.handleSubmit}>
        <TextField controlId='name' label='Full name' formik={formik} />
        <EmailField controlId='email' label='Email' formik={formik} />
        <PasswordField controlId='password' label='Password' formik={formik} />
        <PasswordField
          controlId='passwordConfirmation'
          label='Password Confirmation'
          formik={formik}
        />
        <Button disabled={buttonDisabled} type='submit' variant='primary mt-2'>
          Update
        </Button>
        {loadingUpdateProfile && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;
