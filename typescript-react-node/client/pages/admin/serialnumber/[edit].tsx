import React, { useState } from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
// import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SelectField } from 'form/FormComponents';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { textFieldNoSpaces } from 'form/ValidationSpecs';
import FormButtonBox from 'form/FormButtonBox';
import { UpdateSubmitButton, CancelButton } from 'form/FormButtons';
import Loader from 'components/Loader';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import ModalConfirmBox from 'components/ModalConfirmBox';
import TITLES from 'constants/form-titles';
import PAGES from 'constants/client-pages';
import { ISerialNumber, SerialStatus } from '@orbital_app/common';
import { getSerialByProductIdAndSerialNumber } from 'api/inventory/get-serial-by-product-id-and-serial-number';
import { useUpdateSerialNumberMutation } from 'slices/inventoryApiSlice';

interface IFormInput {
  status: string;
}

const schema = yup.object().shape({
  status: textFieldNoSpaces().required('Required'),
});

interface TPageProps {
  serialNumberObj: ISerialNumber;
  error?: string[];
}

const InventoryEditScreen: React.FC<TPageProps> = ({
  serialNumberObj,
  error,
}) => {
  const [updateSerialNumber, { isLoading: updating, error: errorUpdating }] =
    useUpdateSerialNumberMutation();

  const {
    // register,
    control,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      status: serialNumberObj?.status || '',
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    try {
      await updateSerialNumber({
        productId: serialNumberObj.productId,
        serialNumber: serialNumberObj.serialNumber,
        status: getValues('status'),
      }).unwrap();
      toast.success('Serial Number updated');
      Router.push(`${PAGES.INVENTORY_EDIT_PAGE}/${serialNumberObj.productId}`);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(`${PAGES.INVENTORY_EDIT_PAGE}/${serialNumberObj.productId}`);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(`${PAGES.INVENTORY_EDIT_PAGE}/${serialNumberObj.productId}`);
    }
  };

  const selectStatus: { label: string; value: string }[] = [
    { label: 'Select status', value: '' },
    ...Object.values(SerialStatus).map((status) => ({
      label: status,
      value: status,
    })),
  ];

  const loadingOrProcessing = updating;

  return (
    <>
      <Meta title={TITLES.TITLE_EDIT_SERIAL_NUMBER} />
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
          <FormTitle>{TITLES.TITLE_EDIT_SERIAL_NUMBER}</FormTitle>
          {errorUpdating && <ErrorBlock error={errorUpdating} />}
          {error ? (
            <ErrorBlock error={error} />
          ) : (
            <>
              <Typography>
                <strong>Product Id: </strong> {serialNumberObj.productId}
              </Typography>
              <Typography>
                <strong>Serial Number: </strong> {serialNumberObj.serialNumber}
              </Typography>
              <SelectField
                controlId='status'
                options={selectStatus}
                control={control}
                error={errors.status}
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
  const productId = context.query.edit as string;
  const serialNumber = context.query.serialNumber as string;
  try {
    const serialNumberObj = await getSerialByProductIdAndSerialNumber(
      context,
      productId,
      serialNumber
    );
    return {
      props: { serialNumberObj },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { serialNumberObj: {}, error: parsedError },
    };
  }
};

export default InventoryEditScreen;
