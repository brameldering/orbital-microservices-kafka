import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FormTitle from 'form/FormTitle';
import FormTable from 'form/FormTable';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import ModalConfirmBox from 'components/ModalConfirmBox';
import Paginate from 'components/Paginate';
import TITLES from 'constants/form-titles';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from 'slices/productsApiSlice';
import PAGES from 'constants/client-pages';

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
      // Router.push(PAGES.PRODUCT_LIST_PAGE);
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
      <Meta title={TITLES.TITLE_PRODUCT_ADMIN} />
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
      <Grid
        container
        justifyContent='space-between'
        alignItems='center'
        sx={{ mb: 2 }}>
        <Grid item>
          <FormTitle>{TITLES.TITLE_PRODUCT_ADMIN}</FormTitle>
        </Grid>
        <Grid item>
          <Button
            id='BUTTON_create_product'
            variant='outlined'
            color='primary'
            startIcon={<AddIcon />}
            onClick={confirmCreateProduct}
            disabled={loadingOrProcessing}>
            Create Product
          </Button>
        </Grid>
      </Grid>
      {errorCreating && <ErrorBlock error={errorCreating} />}
      {errorDeleting && <ErrorBlock error={errorDeleting} />}
      {errorLoading ? (
        <ErrorBlock error={errorLoading} />
      ) : data && (!data.products || data.products.length === 0) ? (
        <Typography>There are no products</Typography>
      ) : (
        <FormTable>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>NAME</TableCell>
              <TableCell>PRICE</TableCell>
              <TableCell>BRAND</TableCell>
              <TableCell>CATEGORY</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.sequentialProductId}</TableCell>
                  <TableCell id={`name_${product.sequentialProductId}`}>
                    {product.name}
                  </TableCell>
                  <TableCell>
                    {CURRENCY_SYMBOL}
                    {product.price.toFixed(2)}
                  </TableCell>
                  <TableCell id={`brand_${product.sequentialProductId}`}>
                    {product.brand}
                  </TableCell>
                  <TableCell id={`category_${product.sequentialProductId}`}>
                    {product.category}
                  </TableCell>
                  <TableCell
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}>
                    <Link
                      id={`edit_${product.sequentialProductId}`}
                      href={`${PAGES.PRODUCT_EDIT_PAGE}/${product.id}`}
                      passHref>
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </Link>
                    <IconButton
                      id={`delete_${product.sequentialProductId}`}
                      onClick={() => confirmDeleteProduct(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </FormTable>
      )}
      {data && <Paginate pages={data.pages} page={data.page} isAdmin={true} />}
      {loadingOrProcessing && <Loader />}
    </>
  );
};

export default ProductListScreen;
