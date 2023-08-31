import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

import Meta from '../../components/Meta';
import ErrorMessage from '../../components/messages/ErrorMessage';
import Loader from '../../components/Loader';
import FormContainer from '../../components/formComponents/FormContainer';
import {
  FormGroupTextEdit,
  FormGroupNumberEdit,
} from '../../components/formComponents/FormGroupControls';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const navigate = useNavigate();

  const { id: productId } = useParams();

  const [productIdSeq, setProductIdSeq] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate, error: errorUpdate }] =
    useUpdateProductMutation();

  const [
    uploadProductImage,
    { isLoading: loadingUpload, error: errorUploadImage },
  ] = useUploadProductImageMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        productIdSeq,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setProductIdSeq(product.sequenceProductId);
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Meta title='Edit Product' />
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <ErrorMessage error={errorUpdate} />}
        {errorUploadImage && <ErrorMessage error={errorUploadImage} />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='productId'>
              <Form.Label>Product Id</Form.Label>
              <Form.Control
                type='text'
                placeholder='Unknown'
                value={productIdSeq}
                disabled
              ></Form.Control>
            </Form.Group>

            <FormGroupTextEdit
              controlId='name'
              label='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <FormGroupNumberEdit
              controlId='price'
              label='Price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <FormGroupTextEdit
              controlId='imageURL'
              label='Image'
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />

            <Form.Group>
              <Form.Control
                label='Choose File'
                onChange={uploadFileHandler}
                type='file'
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <FormGroupTextEdit
              controlId='brand'
              label='Brand'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />

            <FormGroupNumberEdit
              controlId='countInStock'
              label='Count In Stock'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />

            <FormGroupTextEdit
              controlId='category'
              label='Category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <FormGroupTextEdit
              controlId='description'
              label='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
