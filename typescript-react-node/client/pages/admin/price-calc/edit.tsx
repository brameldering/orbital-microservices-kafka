import React, { useState } from 'react';
import { NextPageContext } from 'next';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import FormContainer from 'form/FormContainer';
import FormTitle from 'form/FormTitle';
import { TextNumField, CurrencyNumField } from 'form/FormComponents';
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
import { IPriceCalcSettingsAttrs } from '@orbital_app/common';
import { getPriceCalcSettings } from 'api/orders/get-price-calc-settings';
import { useUpdatePriceCalcSettingsMutation } from 'slices/priceCalcSettingsApiSlice';

interface IFormInput {
  vatPercentage: number;
  shippingFee: number;
  thresholdFreeShipping: number;
}

const schema = yup.object().shape({
  vatPercentage: numField().required('Required'),
  shippingFee: numField().required('Required'),
  thresholdFreeShipping: numField().required('Required'),
});

interface TPageProps {
  priceCalcSettings: IPriceCalcSettingsAttrs;
  error?: string[];
}

const PriceCalcSettingsEditScreen: React.FC<TPageProps> = ({
  priceCalcSettings,
  error,
}) => {
  const [
    updatePriceCalcSettings,
    { isLoading: updating, error: errorUpdating },
  ] = useUpdatePriceCalcSettingsMutation();

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { isDirty, errors },
  } = useForm<IFormInput>({
    defaultValues: {
      vatPercentage: priceCalcSettings.vatPercentage,
      shippingFee: priceCalcSettings.shippingFee,
      thresholdFreeShipping: priceCalcSettings.thresholdFreeShipping,
    },
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    try {
      await updatePriceCalcSettings({
        vatPercentage: getValues('vatPercentage'),
        shippingFee: getValues('shippingFee'),
        thresholdFreeShipping: getValues('thresholdFreeShipping'),
      }).unwrap();
      toast.success('PriceCalcSettings updated');
      Router.push(PAGES.PRICE_CALC_VIEW_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const [showChangesModal, setShowChangesModal] = useState(false);
  const goBackWithoutSaving = () => {
    setShowChangesModal(false);
    Router.push(PAGES.PRICE_CALC_VIEW_PAGE);
  };
  const cancelGoBack = () => setShowChangesModal(false);
  const goBackHandler = async () => {
    if (isDirty) {
      setShowChangesModal(true);
    } else {
      Router.push(PAGES.PRICE_CALC_VIEW_PAGE);
    }
  };

  const loadingOrProcessing = updating;

  return (
    <>
      <Meta title={TITLES.TITLE_EDIT_PRICE_CALC} />
      {error ? (
        <ErrorBlock error={error} />
      ) : (
        <>
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
              <FormTitle>{TITLES.TITLE_EDIT_PRICE_CALC}</FormTitle>
              {errorUpdating && <ErrorBlock error={errorUpdating} />}
              <TextNumField
                controlId='vatPercentage'
                label='VAT Percentage'
                register={register}
                error={errors.vatPercentage}
                setError={setError}
              />
              <CurrencyNumField
                controlId='shippingFee'
                label='Shipping Fee'
                register={register}
                error={errors.shippingFee}
                setError={setError}
              />
              <CurrencyNumField
                controlId='thresholdFreeShipping'
                label='Threshold Free Shipping'
                register={register}
                error={errors.thresholdFreeShipping}
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
              {loadingOrProcessing && <Loader />}
            </Box>
          </FormContainer>
        </>
      )}
    </>
  );
};

// Fetch price calc settings
export const getServerSideProps = async (context: NextPageContext) => {
  try {
    // Call the corresponding API function to fetch price settings
    const priceCalcSettings = await getPriceCalcSettings(context);
    return {
      props: { priceCalcSettings },
    };
  } catch (error: any) {
    const parsedError = parseError(error);
    return {
      props: { priceCalcSettings: {}, error: parsedError },
    };
  }
};

export default PriceCalcSettingsEditScreen;
