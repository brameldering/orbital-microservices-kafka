import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { textField, numField } from '../../components/form/ValidationSpecs';
import FormContainer from '../../components/form/FormContainer';
import { TextField, NumberField } from '../../components/form/FormComponents';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import { ErrorMessage } from '../../components/general/Messages';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const navigate = useNavigate();

  const { id: productId } = useParams();

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

  const formik = useFormik({
    initialValues: {
      productIdSeq: product?.sequenceProductId || null,
      name: product?.name || '',
      price: product?.price || 0,
      image: product?.image || '',
      brand: product?.brand || '',
      category: product?.category || '',
      countInStock: product?.countInStock || 0,
      description: product?.description || '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: textField().required('required'),
      price: numField().required('required'),
      image: textField(),
      brand: textField(),
      category: textField(),
      countInStock: numField().required('required'),
      description: textField(),
    }),
    onSubmit: async (values) => {
      const productIdSeq = values.productIdSeq;
      const name = values.name;
      const price = values.price;
      const image = values.image;
      const brand = values.brand;
      const category = values.category;
      const countInStock = values.countInStock;
      const description = values.description;
      try {
        await updateProduct({
          productId,
          productIdSeq,
          name,
          price,
          image,
          brand,
          category,
          countInStock,
          description,
        }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
        toast.success('Product updated');
        refetch();
        navigate('/admin/productlist');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    },
  });

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      formik.setFieldValue('image', res.image);
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
        {errorUpdate && <ErrorMessage error={errorUpdate} />}
        {errorUploadImage && <ErrorMessage error={errorUploadImage} />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage error={error} />
        ) : (
          <Form onSubmit={formik.handleSubmit}>
            <p>
              <strong>Product Id: </strong> {product?.sequenceProductId}
            </p>
            <TextField controlId='name' label='Product name' formik={formik} />
            <NumberField controlId='price' label='Price' formik={formik} />
            <TextField controlId='image' label='Image' formik={formik} />
            <Form.Group>
              <Form.Control
                label='Choose File'
                onChange={uploadFileHandler}
                type='file'
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>
            <TextField controlId='brand' label='Brand' formik={formik} />
            <NumberField
              controlId='countInStock'
              label='Count In Stock'
              formik={formik}
            />
            <TextField controlId='category' label='Category' formik={formik} />
            <TextField
              controlId='description'
              label='Description'
              formik={formik}
            />
            <Button type='submit' variant='primary' className='mt-2'>
              Update
            </Button>
            {loadingUpdate && <Loader />}
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
