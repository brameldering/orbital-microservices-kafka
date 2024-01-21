import React from 'react';
import { NextPageContext } from 'next';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import FormTitle from 'form/FormTitle';
import FormTable from 'form/FormTable';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import TITLES from 'constants/form-titles';
import { IInventory } from '@orbital_app/common';
import PAGES from 'constants/client-pages';
import { getInventory } from 'api/inventory/get-inventory';

interface TPageProps {
  inventory: IInventory[];
  error?: string[];
}

const InventoryListScreen: React.FC<TPageProps> = ({ inventory, error }) => {
  return (
    <>
      <Meta title={TITLES.TITLE_INVENTORY_ADMIN} />
      <Grid
        container
        justifyContent='space-between'
        alignItems='center'
        sx={{ mb: 2 }}>
        <Grid item>
          <FormTitle>{TITLES.TITLE_INVENTORY_ADMIN}</FormTitle>
        </Grid>
      </Grid>
      {error ? (
        <ErrorBlock error={error} />
      ) : (
        <>
          {inventory?.length === 0 ? (
            <Typography>There is no inventory</Typography>
          ) : (
            <FormTable>
              <TableHead>
                <TableRow>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.map((inventory: any) => (
                  <TableRow key={inventory.productId}>
                    <TableCell
                      id={`inventory_product_id_${inventory.productId}`}>
                      {inventory.productId}
                    </TableCell>
                    <TableCell
                      id={`inventory_product_name_${inventory.productId}`}>
                      {inventory.name}
                    </TableCell>
                    <TableCell id={`inventory_quantity_${inventory.productId}`}>
                      {inventory.quantity}
                    </TableCell>
                    <TableCell>
                      <Link
                        id={`edit_${inventory.productId}`}
                        href={`${PAGES.INVENTORY_EDIT_PAGE}/${inventory.productId}`}
                        passHref>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </FormTable>
          )}
        </>
      )}
    </>
  );
};

// Fetch Inventorys
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const inventory = await getInventory(context);
    return {
      props: { inventory },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { inventory: [], error: parsedError },
    };
  }
};

export default InventoryListScreen;
