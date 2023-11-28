import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextNumField, TextAreaField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { textField, textAreaField, numField } from 'form/ValidationSpecs';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import ModalConfirmBox from 'components/ModalConfirmBox';
import { H1_EDIT_PRODUCT } from 'constants/form-titles';
import { PRODUCT_LIST_PAGE } from 'constants/client-pages';
import { IProduct } from '@orbitelco/common';
import { getProductById } from 'api/get-product-by-id';
import {
  useUpdateProductMutation,
  useUploadImageMutation,
} from 'slices/productsApiSlice';

interface IFormInput {
  sequenceProductId?: string;
  name?: string;
  price?: number;
  imageURL?: string;
  brand?: string;
  category?: string;
  countInStock?: number;
  description?: string;
}

const schema = yup.object().shape({
  sequenceProductId: textField(),
  name: textField(),
  price: numField(),
  imageURL: textField(),
  brand: textField(),
  category: textField(),
  countInStock: numField(),
  description: textAreaField(),
});

interface TPageProps {
  product: IProduct;
}

const ProductEditScreen: React.FC<TPageProps> = ({ product }) => {
  const [updateProduct, { isLoading: performingUpdate, error: errorUpdating }] =
    useUpdateProductMutation();

  const [
    uploadImage,
    { isLoading: performinUploadImage, error: errorUploadImage },
  ] = useUploadImageMutation();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      sequenceProductId: product?.sequenceProductId || '',
      name: product?.name || '',
      price: product?.price || 0,
      imageURL: product?.imageURL || '',
      brand: product?.brand || '',
      category: product?.category || '',
      countInStock: product?.countInStock || 0,
      description: product?.description || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    const sequenceProductId = getValues('sequenceProductId') || '';
    const name = getValues('name') || '';
    const imageURL = getValues('imageURL') || '';
    const brand = getValues('brand') || '';
    const category = getValues('category') || '';
    const description = getValues('description') || '';
    const price = getValues('price') || 0;
    const countInStock = getValues('countInStock') || 0;
    try {
      await updateProduct({
        id: product.id,
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
      Router.push(PRODUCT_LIST_PAGE);
    } catch (err) {
      // Do nothing because useUploadImageMutation will set errorUploadImage in case of an error
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (e.target.files && e.target.files.length > 0) {
      formData.append('imageURL', e.target.files[0]);
    }
    try {
      const res = await uploadImage(formData).unwrap();
      setValue('imageURL', res.imageURL);
      toast.success(res.message);
    } catch (err) {
      // Do nothing because useUpdateProductMutation will set errorUpdating in case of an error
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(PRODUCT_LIST_PAGE);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(PRODUCT_LIST_PAGE);
    }
  };

  const loadingOrProcessing = performingUpdate || performinUploadImage;

  return (
    <>
      <Meta title={H1_EDIT_PRODUCT} />
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <FormContainer>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormTitle>{H1_EDIT_PRODUCT}</FormTitle>
          {errorUpdating && <ErrorBlock error={errorUpdating} />}
          {errorUploadImage && <ErrorBlock error={errorUploadImage} />}
          <p>
            <strong>Product Id: </strong> {product?.sequenceProductId}
          </p>
          <TextNumField
            controlId='name'
            label='Product name'
            register={register}
            error={errors.name}
            setError={setError}
          />
          <Form.Group className='my-2' controlId='imageURL'>
            <Form.Label className='my-1'>Image</Form.Label>
            <Row className='align-items-center'>
              <Col md={4}>
                <img
                  src={getValues('imageURL')}
                  alt={getValues('name')}
                  width='80'
                  height='80'
                />
              </Col>
              <Col md={8}>
                <Form.Control
                  name='imageURL'
                  type='text'
                  value={getValues('imageURL')}
                  disabled
                />
              </Col>
            </Row>
            <Form.Control
              name='imageFile'
              onChange={uploadFileHandler}
              type='file'
              className='my-1'></Form.Control>
          </Form.Group>
          {performinUploadImage && <Loader />}
          <TextNumField
            controlId='brand'
            label='Brand'
            register={register}
            error={errors.brand}
            setError={setError}
          />
          <TextNumField
            controlId='price'
            type='number'
            label='Price'
            register={register}
            error={errors.price}
            setError={setError}
          />
          <TextNumField
            controlId='countInStock'
            type='number'
            label='Count In Stock'
            register={register}
            error={errors.countInStock}
            setError={setError}
          />
          <TextNumField
            controlId='category'
            label='Category'
            register={register}
            error={errors.category}
            setError={setError}
          />
          <TextAreaField
            controlId='description'
            label='Description'
            register={register}
            error={errors.description}
            setError={setError}
          />
          <div className='d-flex mt-3 justify-content-between align-items-center'>
            <Button
              id='BUTTON_save'
              type='submit'
              variant='primary'
              disabled={loadingOrProcessing || !isDirty}>
              Save
            </Button>
            <Button
              className='btn btn-light my-3'
              onClick={goBackHandler}
              disabled={loadingOrProcessing}>
              Cancel
            </Button>
          </div>
          {performingUpdate && <Loader />}
        </Form>
      </FormContainer>
    </>
  );
};

// Fetch product
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    // the name of the query parameter ('edit') should match the [filename].tsx
    const id = context.query.edit as string | string[] | undefined;
    let productId = Array.isArray(id) ? id[0] : id;
    if (!productId) {
      productId = '';
    }
    let product = null;
    if (productId) {
      // Call the corresponding API function to fetch product data
      product = await getProductById(context, productId);
    }
    return {
      props: { product },
    };
  } catch (error) {
    // Handle errors if any
    console.error('Error fetching data:', error);
    return {
      props: { product: {} },
    };
  }
};

export default ProductEditScreen;
