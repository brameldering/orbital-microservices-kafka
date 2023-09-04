import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import { ErrorMessage } from '../../components/general/Messages';
import Paginate from '../../components/general/Paginate';
import ModalConfirmBox from '../../components/general/ModalConfirmBox';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';
import { CURRENCY_SYMBOL } from '../../constants';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  // --------------- Get Products ---------------
  const { data, isLoading, errorLoading, refetch } = useGetProductsQuery({
    pageNumber,
  });

  // --------------- Create Product ---------------
  const [createProduct, { isLoading: loadingCreate, error: errorCreate }] =
    useCreateProductMutation();

  const [confirmCreateProductModal, setConfirmCreateProductModal] =
    useState(false);

  const confirmCreateProduct = () => setConfirmCreateProductModal(true);
  const cancelCreateProduct = () => setConfirmCreateProductModal(false);

  const createProductHandler = async () => {
    setConfirmCreateProductModal(false);
    try {
      await createProduct().unwrap();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      setConfirmCreateProductModal(false);
    }
  };

  // --------------- Delete Product ---------------
  const [deleteProduct, { isLoading: loadingDelete, error: errorDelete }] =
    useDeleteProductMutation();

  const [confirmDeleteProductModal, setConfirmDeleteProductModal] =
    useState(false);
  const [deleteProductId, setDeleteProductId] = useState();

  const confirmDeleteProduct = (id) => {
    setDeleteProductId(id);
    setConfirmDeleteProductModal(true);
  };
  const cancelDeleteProduct = () => setConfirmDeleteProductModal(false);

  const deleteProductHandler = async () => {
    try {
      await deleteProduct(deleteProductId).unwrap();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    } finally {
      setConfirmDeleteProductModal(false);
    }
  };

  // --------------------------------------------
  return (
    <>
      <Meta title='Manage Products' />
      <ModalConfirmBox
        showModal={confirmCreateProductModal}
        title='Create Product'
        body='Are you sure you want to create a new product?'
        handleClose={cancelCreateProduct}
        handleConfirm={createProductHandler}
      />
      <ModalConfirmBox
        showModal={confirmDeleteProductModal}
        title='Delete Product'
        body='Are you sure you want to delete this product?'
        handleClose={cancelDeleteProduct}
        handleConfirm={deleteProductHandler.bind(this)}
      />
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={confirmCreateProduct}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>
      {errorCreate && <ErrorMessage error={errorCreate} />}
      {errorDelete && <ErrorMessage error={errorDelete} />}
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorMessage error={errorLoading} />
      ) : (
        <>
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product.sequenceProductId}</td>
                  <td>{product.name}</td>
                  <td>
                    {CURRENCY_SYMBOL}
                    {Number(product.price).toFixed(2)}
                  </td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => confirmDeleteProduct(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          {loadingCreate && <Loader />}
          {loadingDelete && <Loader />}
        </>
      )}
    </>
  );
};

export default ProductListScreen;
