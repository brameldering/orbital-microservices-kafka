import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  textField,
  passwordField,
} from '../../components/form/ValidationSpecs';
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
import { useGetMyOrdersQuery } from '../../slices/ordersApiSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  // console.log('ProfileScreen - userInfo', userInfo);
  const {
    data: orders,
    isLoading,
    error: errorLoading,
  } = useGetMyOrdersQuery(userInfo._id);

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

  const buttonDisabled = isLoading || loadingUpdateProfile;

  return (
    <>
      <Meta title='Profile' />
      {errorUpdate && <ErrorMessage error={errorUpdate} />}
      <Row>
        <Col md={3}>
          <h2>My Profile</h2>
          <Form onSubmit={formik.handleSubmit}>
            <TextField controlId='name' label='Full name' formik={formik} />
            <EmailField controlId='email' label='Email' formik={formik} />
            <PasswordField
              controlId='password'
              label='Password'
              formik={formik}
            />
            <PasswordField
              controlId='passwordConfirmation'
              label='Password Confirmation'
              formik={formik}
            />
            <Button
              disabled={buttonDisabled}
              type='submit'
              variant='primary mt-2'
            >
              Update
            </Button>
            {loadingUpdateProfile && <Loader />}
          </Form>
        </Col>
        <Col md={9}>
          <h2>My Orders</h2>
          {isLoading ? (
            <Loader />
          ) : errorLoading ? (
            <ErrorMessage error={errorLoading} />
          ) : (
            <Table striped hover responsive className='table-sm'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAID</th>
                  <th>DELIVERED</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.sequenceOrderId}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <FaTimes style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/order/${order._id}`}>
                        <Button className='btn-sm' variant='light'>
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen;
