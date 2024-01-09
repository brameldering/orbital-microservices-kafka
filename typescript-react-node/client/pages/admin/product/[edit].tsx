import React, { useState } from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm, Resolver } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, TextField, Button, Grid, Typography } from '@mui/material';
import {
  TextNumField,
  CurrencyNumField,
  TextAreaField,
} from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { textField, textAreaField, numField } from 'form/ValidationSpecs';
import FormButtonBox from 'form/FormButtonBox';
import { UpdateSubmitButton, CancelButton } from 'form/FormButtons';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components/ModalConfirmBox';
import { TITLE_EDIT_PRODUCT } from 'constants/form-titles';
import { PRODUCT_LIST_PAGE } from 'constants/client-pages';
import { IProduct } from '@orbitelco/common';
import { getProductById } from 'api/produts/get-product-by-id';
import {
  useUpdateProductMutation,
  useUploadImageMutation,
} from 'slices/productsApiSlice';

interface IFormInput {
  sequentialProductId: string;
  name: string;
  price: number;
  imageURL: string;
  brand: string;
  category: string;
  countInStock: number;
  description: string;
}

const schema = yup.object().shape({
  sequentialProductId: textField(),
  name: textField().max(80).required('Required'),
  price: numField().required('Required'),
  imageURL: textField().required('Required'),
  brand: textField().max(40).required('Required'),
  category: textField().max(40).required('Required'),
  countInStock: numField().required('Required'),
  description: textAreaField().max(1024).required('Required'),
});

interface TPageProps {
  product: IProduct;
  error?: string[];
}

const ProductEditScreen: React.FC<TPageProps> = ({ product, error }) => {
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
      sequentialProductId: product.sequentialProductId,
      name: product.name,
      price: product.price,
      imageURL: product.imageURL,
      brand: product.brand,
      category: product.category,
      countInStock: product.countInStock,
      description: product.description,
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema) as Resolver<IFormInput>,
  });

  const onSubmit = async () => {
    try {
      await updateProduct({
        id: product.id,
        sequentialProductId: getValues('sequentialProductId') || '',
        name: getValues('name') || '',
        imageURL: getValues('imageURL') || '',
        brand: getValues('brand') || '',
        category: getValues('category') || '',
        description: getValues('description') || '',
        price: getValues('price') || 0,
        countInStock: getValues('countInStock') || 0,
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
      <Meta title={TITLE_EDIT_PRODUCT} />
      <ModalConfirmBox
        showModal={showChangesModal}
        title='Are you sure you want to go back?'
        body='All the new and changed info will be lost.'
        handleClose={cancelGoBack}
        handleConfirm={goBackWithoutSaving}
      />
      <FormContainer>
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}>
          <FormTitle>{TITLE_EDIT_PRODUCT}</FormTitle>
          {errorUpdating && <ErrorBlock error={errorUpdating} />}
          {errorUploadImage && <ErrorBlock error={errorUploadImage} />}
          {error ? (
            <ErrorBlock error={error} />
          ) : (
            <>
              <Typography>
                <strong>Product Id: </strong> {product?.sequentialProductId}
              </Typography>
              <TextNumField
                controlId='name'
                label='Product name'
                register={register}
                error={errors.name}
                setError={setError}
              />
              <Box sx={{ my: 2 }}>
                <Typography variant='subtitle1' sx={{ mb: 1 }}>
                  Image
                </Typography>
                <Grid container alignItems='center' spacing={2}>
                  <Grid item md={4}>
                    <img
                      src={getValues('imageURL')}
                      alt={getValues('name')}
                      style={{ width: '80px', height: '80px' }}
                    />
                  </Grid>
                  <Grid item md={8}>
                    <TextField
                      name='imageURL'
                      type='text'
                      value={getValues('imageURL')}
                      disabled
                      fullWidth
                      variant='outlined'
                    />
                  </Grid>
                </Grid>
                <Button component='label' variant='contained' sx={{ mt: 1 }}>
                  Upload Image
                  <input
                    name='imageFile'
                    type='file'
                    hidden
                    onChange={uploadFileHandler}
                  />
                </Button>
              </Box>
              {performinUploadImage && <Loader />}
              <TextNumField
                controlId='brand'
                label='Brand'
                register={register}
                error={errors.brand}
                setError={setError}
              />
              <CurrencyNumField
                controlId='price'
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
              <FormButtonBox>
                <UpdateSubmitButton
                  disabled={loadingOrProcessing || !isDirty}
                />
                <CancelButton
                  disabled={loadingOrProcessing}
                  onClick={goBackHandler}
                />
              </FormButtonBox>
              {loadingOrProcessing && <Loader />}
            </>
          )}
        </Box>
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
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { product: {}, error: parsedError },
    };
  }
};

export default ProductEditScreen;
