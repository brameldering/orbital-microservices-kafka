import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Meta from '../../components/general/Meta';
import Loader from '../../components/general/Loader';
import ErrorMessage from '../../components/general/ErrorMessage';
import Paginate from '../../components/general/Paginate';
import ModalConfirmBox from '../../components/general/ModalConfirmBox';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice';
import { CURRENCY_SYMBOL } from '../../constantsFrontend';

const ProductListScreen = () => {
  const { pageNumber } = useParams();

  // --------------- Get Products ---------------
  const {
    data,
    isLoading,
    error: errorLoading,
    refetch,
  } = useGetProductsQuery({
    pageNumber,
  });

  // --------------- Create Product ---------------
  const [createProduct, { isLoading: creating, error: errorCreating }] =
    useCreateProductMutation();

  const [confirmCreateProductModal, setConfirmCreateProductModal] =
    useState<boolean>(false);

  const confirmCreateProduct = () => setConfirmCreateProductModal(true);
  const cancelCreateProduct = () => setConfirmCreateProductModal(false);

  const createProductHandler = async () => {
    setConfirmCreateProductModal(false);
    try {
      await createProduct().unwrap();
      refetch();
    } catch (err) {
      // Do nothing because useCreateProductMutation will set errorCreating in case of an error
    } finally {
      setConfirmCreateProductModal(false);
    }
  };

  // --------------- Delete Product ---------------
  const [deleteProduct, { isLoading: deleting, error: errorDeleting }] =
    useDeleteProductMutation();

  const [confirmDeleteProductModal, setConfirmDeleteProductModal] =
    useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string>('');

  const confirmDeleteProduct = (id: string) => {
    setDeleteProductId(id);
    setConfirmDeleteProductModal(true);
  };
  const cancelDeleteProduct = () => setConfirmDeleteProductModal(false);

  const deleteProductHandler = async () => {
    try {
      await deleteProduct(deleteProductId).unwrap();
      refetch();
    } catch (err) {
      // Do nothing because useDeleteProductMutation will set errorDeleting in case of an error
    } finally {
      setConfirmDeleteProductModal(false);
    }
  };

  // --------------------------------------------

  const disableSubmit = isLoading || creating || deleting;

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
          <Button
            className='my-3'
            onClick={confirmCreateProduct}
            disabled={disableSubmit}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>
      {errorCreating && <ErrorMessage error={errorCreating} />}
      {errorDeleting && <ErrorMessage error={errorDeleting} />}
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
              {data &&
                data.products.map((product) => (
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
                        onClick={() => confirmDeleteProduct(product._id)}>
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          {data && (
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          )}
          {(creating || deleting) && <Loader />}
        </>
      )}
    </>
  );
};

export default ProductListScreen;