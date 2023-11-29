import React, { useState } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import ModalConfirmBox from 'components/ModalConfirmBox';
import Paginate from 'components/Paginate';
import { H1_PRODUCT_ADMIN } from 'constants/form-titles';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from 'slices/productsApiSlice';
import { PRODUCT_EDIT_PAGE } from 'constants/client-pages';

const ProductListScreen = () => {
  const router = useRouter();
  const pagenumber = router.query.pagenumber as string | undefined;

  // --------------- Get Products ---------------
  const {
    data,
    isLoading,
    error: errorLoading,
    refetch,
  } = useGetProductsQuery({
    pagenumber,
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
      // Router.push(PRODUCT_LIST_PAGE);
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

  const loadingOrProcessing = isLoading || creating || deleting;

  return (
    <>
      <Meta title={H1_PRODUCT_ADMIN} />
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
      <Row className='align-items-center my-0'>
        <Col>
          <h1>{H1_PRODUCT_ADMIN}</h1>
        </Col>
        <Col className='text-end'>
          <Button
            id='BUTTON_create_product'
            className='my-3'
            onClick={confirmCreateProduct}
            disabled={loadingOrProcessing}>
            <FaPlus /> Create Product
          </Button>
        </Col>
      </Row>
      {errorCreating && <ErrorBlock error={errorCreating} />}
      {errorDeleting && <ErrorBlock error={errorDeleting} />}
      {isLoading ? (
        <Loader />
      ) : errorLoading ? (
        <ErrorBlock error={errorLoading} />
      ) : data && (!data.products || data.products.length === 0) ? (
        <p>There are no products</p>
      ) : (
        <>
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>BRAND</th>
                <th>CATEGORY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.sequentialProductId}</td>
                    <td id={`name_${product.sequentialProductId}`}>
                      {product.name}
                    </td>
                    <td>
                      {CURRENCY_SYMBOL}
                      {product.price.toFixed(2)}
                    </td>
                    <td id={`brand_${product.sequentialProductId}`}>
                      {product.brand}
                    </td>
                    <td id={`category_${product.sequentialProductId}`}>
                      {product.category}
                    </td>
                    <td>
                      <Link href={`${PRODUCT_EDIT_PAGE}/${product.id}`}>
                        <Button
                          id={`edit_${product.id}`}
                          variant='light'
                          className='btn-sm mx-2'>
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        id={`delete_${product.id}`}
                        variant='danger'
                        className='btn-sm'
                        onClick={() => confirmDeleteProduct(product.id)}>
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
