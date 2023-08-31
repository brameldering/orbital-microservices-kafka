import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Meta from '../../components/Meta';
import FormContainer from '../../components/formComponents/FormContainer';
import { FormGroupTextEdit } from '../../components/formComponents/FormGroupControls';
import CheckoutSteps from '../../components/order/CheckoutSteps';
import { saveShippingAddress } from '../../slices/cartSlice';

const ShippingScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <>
      <Meta title='Shipping Address' />
      <CheckoutSteps currentStep={1} />
      <FormContainer>
        <h1>Address</h1>
        <Form onSubmit={submitHandler}>
          <FormGroupTextEdit
            controlId='address'
            label='Address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <FormGroupTextEdit
            controlId='city'
            label='City'
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <FormGroupTextEdit
            controlId='postalCode'
            label='Postal Code'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />

          <FormGroupTextEdit
            controlId='country'
            label='Country'
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
