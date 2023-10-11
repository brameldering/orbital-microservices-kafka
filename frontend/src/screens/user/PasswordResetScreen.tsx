import { useFormik } from 'formik';
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { EmailField } from '../../components/form/FormComponents';
import FormContainer from '../../components/form/FormContainer';
import { textField } from '../../components/form/ValidationSpecs';
import ErrorMessage from '../../components/general/ErrorMessage';
import Loader from '../../components/general/Loader';
import Meta from '../../components/general/Meta';
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
      email: textField().required('Required').email('Invalid email address'),
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

  const loadingOrProcessing = resettingPassword;

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
          id='BUTTON_reset_password'
          disabled={loadingOrProcessing || !formik.dirty}
          type='submit'
          variant='primary mt-2'>
          Reset Password
        </Button>
        {loadingOrProcessing && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default PasswordResetScreen;
