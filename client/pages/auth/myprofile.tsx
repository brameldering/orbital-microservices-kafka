import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { TextNumField } from 'form/FormComponents';
import { textField } from 'form/ValidationSpecs';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import { H1_MY_PROFILE } from 'constants/form-titles';
import { CHANGE_PASSWORD_PAGE } from 'constants/client-pages';
import type { RootState } from 'slices/store';
import { updUserState } from 'slices/authSlice';
import { useChangeUserProfileMutation } from 'slices/usersApiSlice';

interface IFormInput {
  name: string;
  email: string;
}

const schema = yup.object().shape({
  name: textField().max(80).required('Required'),
  email: textField()
    .max(40)
    .required('Required')
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

  const [changeUserProfile, { isLoading: isProcessing, error: errorChanging }] =
    useChangeUserProfileMutation();
  const onSubmit = async () => {
    try {
      const updatedUser = await changeUserProfile({
        name: getValues('name'),
        email: getValues('email'),
      }).unwrap();
      dispatch(updUserState(updatedUser));
      toast.success('Profile updated');
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const onError = (error: any) => {
    console.log('ERROR:::', error);
  };

  return (
    <>
      <Meta title={H1_MY_PROFILE} />
      <FormContainer>
        <Form onSubmit={handleSubmit(onSubmit, onError)}>
          <FormTitle>{H1_MY_PROFILE}</FormTitle>
          <TextNumField
            controlId='name'
            label='Full name'
            register={register}
            error={errors.name}
            setError={setError}
          />
          <TextNumField
            controlId='email'
            label='Email'
            register={register}
            error={errors.email}
            setError={setError}
          />
          {errorChanging && <ErrorBlock error={errorChanging} />}

          <div className='d-flex mt-3 justify-content-between align-items-center'>
            <Button
              id='BUTTON_update'
              type='submit'
              variant='primary'
              disabled={isProcessing || !isDirty}>
              Update
            </Button>
            <Link id='LINK_change_password' href={CHANGE_PASSWORD_PAGE}>
              Change Password
            </Link>
          </div>
          {isProcessing && <Loader />}
        </Form>
      </FormContainer>
    </>
  );
};

export default ProfileScreen;
