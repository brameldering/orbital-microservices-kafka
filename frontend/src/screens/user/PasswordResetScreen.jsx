import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { textField } from '../../components/form/ValidationSpecs';
import FormContainer from '../../components/form/FormContainer';
import { EmailField } from '../../components/form/FormComponents';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import { ErrorMessage } from '../../components/general/Messages';
import { useResetPasswordMutation } from '../../slices/usersApiSlice';

const PasswordResetScreen = () => {
  const navigate = useNavigate();

  const [
    resetPassword,
    { isLoading: resettingPassword, error: errorResettingPassword },
  ] = useResetPasswordMutation();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: textField().required('required').email('Invalid email address'),
    }),
    onSubmit: async (values) => {
      const email = values.email;
      try {
        await resetPassword({ email }).unwrap();
        navigate('/passwordresetconfirmation');
      } catch (err) {
        // Do nothing because useLoginMutation will set errorLogin in case of an error
      }
    },
  });

  return (
    <FormContainer>
      <Meta title='Reset Password' />
      <h1>Reset Password</h1>
      {errorResettingPassword && (
        <ErrorMessage error={errorResettingPassword} />
      )}
      <Form onSubmit={formik.handleSubmit}>
        <EmailField
          controlId='email'
          label='Your email address as known to us'
          formik={formik}
        />
        <Button
          disabled={resettingPassword}
          type='submit'
          variant='primary mt-2'
        >
          Reset Password
        </Button>
        {resettingPassword && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default PasswordResetScreen;
