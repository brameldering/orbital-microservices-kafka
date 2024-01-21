import React, { useState } from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TextNumField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { numField } from 'form/ValidationSpecs';
import FormButtonBox from 'form/FormButtonBox';
import { UpdateSubmitButton, CancelButton } from 'form/FormButtons';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components/ModalConfirmBox';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
import { IInventory } from '@orbital_app/common';
import { getInventoryById } from 'api/inventory/get-inventory-by-id';
import { useUpdateInventoryMutation } from 'slices/inventoryApiSlice';

interface IFormInput {
  quantity: number;
}

const schema = yup.object().shape({
  quantity: numField().required('Required'),
});

interface TPageProps {
  inventoryObj: IInventory;
  error?: string[];
}

const InventoryEditScreen: React.FC<TPageProps> = ({ inventoryObj, error }) => {
  const [updateInventory, { isLoading: updating, error: errorUpdating }] =
    useUpdateInventoryMutation();

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      quantity: inventoryObj?.quantity || 0,
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    try {
      await updateInventory({
        productId: inventoryObj.productId,
        name: inventoryObj.name,
        brand: inventoryObj.brand,
        category: inventoryObj.category,
        quantity: getValues('quantity'),
      }).unwrap();
      toast.success('Inventory updated');
      Router.push(PAGES.INVENTORY_LIST_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(PAGES.INVENTORY_LIST_PAGE);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(PAGES.INVENTORY_LIST_PAGE);
    }
  };

  const loadingOrProcessing = updating;

  return (
    <>
      <Meta title={TITLES.TITLE_EDIT_INVENTORY} />
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
          <FormTitle>{TITLES.TITLE_EDIT_INVENTORY}</FormTitle>
          {errorUpdating && <ErrorBlock error={errorUpdating} />}
          {error ? (
            <ErrorBlock error={error} />
          ) : (
            <>
              <Typography>
                <strong>Product Id: </strong> {inventoryObj.productId}
              </Typography>
              <Typography>
                <strong>Product name: </strong> {inventoryObj.name}
              </Typography>
              <Typography>
                <strong>Product brand: </strong> {inventoryObj.brand}
              </Typography>
              <Typography>
                <strong>Product category: </strong> {inventoryObj.category}
              </Typography>
              <TextNumField
                controlId='quantity'
                label='Inventory Quantity'
                register={register}
                error={errors.quantity}
                setError={setError}
              />
              <FormButtonBox>
                <CancelButton
                  disabled={loadingOrProcessing}
                  onClick={goBackHandler}
                />
                <UpdateSubmitButton
                  disabled={loadingOrProcessing || !isDirty}
                />
              </FormButtonBox>
            </>
          )}
          {loadingOrProcessing && <Loader />}
        </Box>
      </FormContainer>
    </>
  );
};

// Fetch inventory
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    // the name of the query parameter ('edit') should match the [filename].tsx
    const id = context.query.edit as string | string[] | undefined;
    let inventoryId = Array.isArray(id) ? id[0] : id;
    if (!inventoryId) {
      inventoryId = '';
    }
    let inventoryObj = null;
    if (inventoryId) {
      // Call the corresponding API function to fetch inventory data
      inventoryObj = await getInventoryById(context, inventoryId);
    }
    return {
      props: { inventoryObj },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { inventoryObj: {}, error: parsedError },
    };
  }
};

export default InventoryEditScreen;
