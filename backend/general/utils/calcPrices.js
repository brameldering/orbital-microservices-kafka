const roundTo2Decimals = (num) => {
  return Math.round(num * 100) / 100;
};

export const calcPrices = (items) => {
  const VAT_FRACTION = process.env.VAT_PERCENTAGE / 100;
  const SHIPPING_FEE = process.env.SHIPPING_FEE;
  // Calculate the total items price
  const itemsPrice = roundTo2Decimals(
    items.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = roundTo2Decimals(itemsPrice > 100 ? 0 : SHIPPING_FEE);
  const taxPrice = roundTo2Decimals(VAT_FRACTION * itemsPrice);
  const totalPrice = roundTo2Decimals(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};
