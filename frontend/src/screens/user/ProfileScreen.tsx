import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { textField } from '../../components/form/ValidationSpecs';
import FormContainer from '../../components/form/FormContainer';
import { TextField, EmailField } from '../../components/form/FormComponents';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import ErrorMessage from '../../components/general/ErrorMessage';
import { setUserInfo } from '../../slices/authSlice';
import { useUpdateProfileMutation } from '../../slices/usersApiSlice';
import type { RootState } from '../../store';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [updateProfile, { isLoading: updatingProfile, error: errorUpdating }] =
    useUpdateProfileMutation();

  const formik = useFormik({
    initialValues: {
      name: userInfo?.name || '',
      email: userInfo?.email || '',
    },
    validationSchema: Yup.object({
      name: textField().required('required'),
      email: textField().required('required').email('Invalid email address'),
    }),
    onSubmit: async (values) => {
      const name = values.name;
      const email = values.email;
      try {
        const res = await updateProfile({
          _id: userInfo!._id,
          name,
          email,
        }).unwrap();
        dispatch(setUserInfo({ ...res }));
        toast.success('Profile updated');
      } catch (err) {
        // Do nothing because useUpdateProfileMutation will set errorUpdating in case of an error
      }
    },
  });

  const buttonDisabled = updatingProfile;

  return (
    <FormContainer>
      <Meta title='My Profile' />
      <h1>My Profile</h1>
      {errorUpdating && <ErrorMessage error={errorUpdating} />}
      <Form onSubmit={formik.handleSubmit}>
        <TextField controlId='name' label='Full name' formik={formik} />
        <EmailField controlId='email' label='Email' formik={formik} />
        <Row className='align-items-center'>
          <Col>
            <Button
              disabled={buttonDisabled}
              type='submit'
              variant='primary mt-2'>
              Update
            </Button>
          </Col>
          <Col className='text-end'>
            <Link to='/password'>Change Password</Link>
          </Col>
        </Row>
        {updatingProfile && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;
