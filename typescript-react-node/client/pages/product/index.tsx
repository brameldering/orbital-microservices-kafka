import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormTitle from 'form/FormTitle';
import Meta from 'components/Meta';
import Loader from 'components/Loader';
import ErrorBlock from 'components/ErrorBlock';
import Paginate from 'components/Paginate';
import ProductComponent from 'components/ProductComponent';
import TITLES from 'constants/form-titles';
import { IProduct, ADMIN_ROLE } from '@orbital_app/common';
import PAGES from 'constants/client-pages';
import type { RootState } from 'slices/store';
import { useGetProductsQuery } from 'slices/productsApiSlice';

const ProductsPage: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const keyword = router.query.keyword as string | undefined;
  const pagenumber = router.query.pagenumber as string | undefined;

  const isAdmin = userInfo && userInfo.role === ADMIN_ROLE ? true : false;

  const {
    data: catalogData,
    isLoading: isLoadingCatalog,
    error: errorLoadingCatalog,
  } = useGetProductsQuery({
    keyword: keyword || '',
    pagenumber: pagenumber || '',
  });

  const loadingOrProcessing = isLoadingCatalog;

  return (
    <>
      <Meta title={TITLES.TITLE_SHOP} />
      <FormTitle>{TITLES.TITLE_SHOP}</FormTitle>
      {keyword && (
        <Link href={PAGES.PRODUCTS_PAGE} passHref>
          <Button variant='outlined' sx={{ mb: 2 }}>
            Go Back
          </Button>
        </Link>
      )}
      {loadingOrProcessing ? (
        <Loader />
      ) : errorLoadingCatalog ? (
        <ErrorBlock error={errorLoadingCatalog} />
      ) : (
        <>
          <Grid container spacing={2}>
            {catalogData && catalogData.products.length > 0 ? (
              catalogData.products.map((product: IProduct) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductComponent product={product} />
                </Grid>
              ))
            ) : (
              <Typography>No products match the search keyword</Typography>
            )}
          </Grid>
          {catalogData && (
            <Box sx={{ my: 2 }}>
              <Paginate
                pages={catalogData.pages}
                page={catalogData.page}
                keyword={keyword ? keyword : ''}
                isAdmin={isAdmin}
              />
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default ProductsPage;
