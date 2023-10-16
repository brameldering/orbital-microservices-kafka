import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import {
  TextField,
  NumberField,
  TextAreaField,
  // HiddenTextField,
} from '../../components/form/FormComponents';
import FormContainer from '../../components/form/FormContainer';
import {
  textField,
  textAreaField,
  numField,
} from '../../components/form/ValidationSpecs';
import ErrorMessage from '../../components/general/ErrorMessage';
import Loader from '../../components/general/Loader';
import Meta from '../../components/general/Meta';
import ModalConfirmBox from '../../components/general/ModalConfirmBox';
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadImageMutation,
} from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  let productId: string = '';
  if (id && id.length > 0) {
    productId = id;
  }

  const {
    data: product,
    isLoading,
    refetch,
    error: errorLoading,
  } = useGetProductByIdQuery(productId);

  const [updateProduct, { isLoading: performingUpdate, error: errorUpdating }] =
    useUpdateProductMutation();

  const [
    uploadImage,
    { isLoading: performinUploadImage, error: errorUploadImage },
  ] = useUploadImageMutation();

  const formik = useFormik({
    initialValues: {
      sequenceProductId: product?.sequenceProductId || '',
      name: product?.name || '',
      price: product?.price || 0,
      imageURL: product?.imageURL || '',
      brand: product?.brand || '',
      category: product?.category || '',
      countInStock: product?.countInStock || 0,
      description: product?.description || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: textField().required('Required'),
      price: numField().required('Required'),
      imageURL: textField(),
      brand: textField(),
      category: textField(),
      countInStock: numField().required('Required'),
      description: textAreaField(),
    }),
    onSubmit: async (values) => {
      const sequenceProductId = values.sequenceProductId;
      const name = values.name;
      const imageURL = values.imageURL;
      const brand = values.brand;
      const category = values.category;
      const description = values.description;
      const price = values.price;
      const countInStock = values.countInStock;
      try {
        await updateProduct({
          _id: productId,
          sequenceProductId,
          name,
          imageURL,
          brand,
          category,
          description,
          price,
          countInStock,
        }).unwrap();
        toast.success('Product updated');
        refetch();
        navigate('/admin/productlist');
      } catch (err) {
        // Do nothing because useUploadImageMutation will set errorUploadImage in case of an error
      }
    },
  });

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (e.target.files && e.target.files.length > 0) {
      formData.append('imageURL', e.target.files[0]);
    }
    try {
      const res = await uploadImage(formData).unwrap();
      formik.setFieldValue('imageURL', res.imageURL);
      toast.success(res.message);
    } catch (err) {
      // Do nothing because useUpdateProductMutation will set errorUpdating in case of an error
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    navigate('/admin/productlist');
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (formik.dirty) {
      setShowChangesModal(true);
    } else {
      navigate('/admin/productlist');
    }
  };

  const loadingOrProcessing =
    isLoading || performingUpdate || performinUploadImage;

  return (
    <>
      <Meta title='Edit Product' />
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <Button
        className='btn btn-light my-3'
        onClick={goBackHandler}
        disabled={loadingOrProcessing}>
        Go Back
      </Button>
      <FormContainer>
        <h1>Edit Product</h1>
        {errorUpdating && <ErrorMessage error={errorUpdating} />}
        {errorUploadImage && <ErrorMessage error={errorUploadImage} />}
        {isLoading ? (
          <Loader />
        ) : errorLoading ? (
          <ErrorMessage error={errorLoading} />
        ) : (
          <Form onSubmit={formik.handleSubmit}>
            <p>
              <strong>Product Id: </strong> {product?.sequenceProductId}
            </p>
            <TextField controlId='name' label='Product name' formik={formik} />
            <Form.Group className='my-2' controlId='imageURL'>
              <Form.Label className='my-1'>Image</Form.Label>
              <Row className='align-items-center'>
                <Col md={4}>
                  <img
                    src={formik.values.imageURL}
                    alt={formik.values.name}
                    width='80'
                    height='80'
                  />
                </Col>
                <Col md={8}>
                  <Form.Control
                    name='imageURL'
                    type='text'
                    value={formik.values.imageURL}
                    disabled
                  />
                </Col>
                {/* <HiddenTextField controlId='imageURL' formik={formik} /> */}
              </Row>
              <Form.Control
                name='imageFile'
                onChange={uploadFileHandler}
                type='file'
                className='my-1'></Form.Control>
            </Form.Group>
            {performinUploadImage && <Loader />}
            <TextField controlId='brand' label='Brand' formik={formik} />
            <NumberField controlId='price' label='Price' formik={formik} />
            <NumberField
              controlId='countInStock'
              label='Count In Stock'
              formik={formik}
            />
            <TextField controlId='category' label='Category' formik={formik} />
            <TextAreaField
              controlId='description'
              label='Description'
              formik={formik}
            />
            <Button
              id='BUTTON_save'
              type='submit'
              variant='primary'
              className='mt-2'
              disabled={loadingOrProcessing || !formik.dirty}>
              Save
            </Button>
            {performingUpdate && <Loader />}
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
