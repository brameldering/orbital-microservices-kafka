import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormContainer from '../../form/FormContainer';
import { FormField } from '../../form/FormComponents';
import { textField } from 'form/ValidationSpecs';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import type { RootState } from '../../slices/store';
import useRequest from 'hooks/use-request';
import { BASE_URL } from 'constants/constants-frontend';
import { UPDATE_PROFILE_URL } from '@orbitelco/common';
import { updUserState } from '../../slices/authSlice';

interface IFormInput {
  name: string;
  email: string;
}

const schema = yup.object().shape({
  name: textField().required('Name is required'),
  email: textField()
    .required('Email is required')
    .email('Invalid email address'),
});

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: { name: userInfo?.name, email: userInfo?.email },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const {
    doRequest,
    isProcessing,
    error: errorChanging,
  } = useRequest({
    url: BASE_URL + UPDATE_PROFILE_URL,
    method: 'put',
    onSuccess: () => {
      toast.success('Profile updated');
    },
  });

  const onSubmit = async () => {
    const name = getValues('name');
    const email = getValues('email');
    const updatedUser = await doRequest({ body: { name, email } });
    dispatch(updUserState(updatedUser));
  };

  const onError = (error: any) => {
    console.log('ERROR:::', error);
  };

  return (
    <FormContainer>
      <Meta title='My Profile' />
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <h1>My Profile</h1>
        {isProcessing && <Loader />}
        <FormField
          controlId='name'
          label='Full name'
          register={register}
          error={errors.name}
          setError={setError}
        />
        <FormField
          controlId='email'
          label='Email'
          register={register}
          error={errors.email}
          setError={setError}
        />
        {errorChanging && <ErrorBlock error={errorChanging} />}
        <br />
        <Row className='align-items-center'>
          <Col>
            <Button
              id='BUTTON_update'
              type='submit'
              variant='primary mt-0'
              disabled={isProcessing || !isDirty}>
              Update
            </Button>
          </Col>
          <Col className='text-end'>
            <Link id='LINK_change_password' href='/auth/changepassword'>
              Change Password
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;
