const { calcPrices } = require('./calcPrices.ts');

describe('calcPrices', () => {
  it('should return correct calcPrices for 1 item with shippingfee', () => {
    const VAT_FRACTION = Number(
      process.env.VAT_PERCENTAGE && Number(process.env.VAT_PERCENTAGE) / 100
    );
    const SHIPPING_FEE = Number(process.env.SHIPPING_FEE);
    const THRESHOLD_FREE_SHIPPING = Number(process.env.THRESHOLD_FREE_SHIPPING);

    const OrderItem_1 = {
      productId: 'DUMMY PRODUCT ID',
      productName: 'Test Product 1',
      imageURL: 'DUMMY IMAGE URL',
      price: 10,
      qty: 1,
      _id: 'DUMMY ID',
    };
    const OrderItemArray = [OrderItem_1];
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      calcPrices(OrderItemArray);

    expect(itemsPrice).toEqual(10);
    const expectedShippingFee =
      itemsPrice > THRESHOLD_FREE_SHIPPING ? 0 : SHIPPING_FEE;
    expect(shippingPrice).toEqual(expectedShippingFee);
    expect(taxPrice).toEqual(VAT_FRACTION * itemsPrice);
    expect(totalPrice).toEqual(itemsPrice + shippingPrice + taxPrice);
  });
  it('should return correct calcPrices for 2 items with qty total 3 with free shippingfee', () => {
    const VAT_FRACTION = Number(
      process.env.VAT_PERCENTAGE && Number(process.env.VAT_PERCENTAGE) / 100
    );
    const SHIPPING_FEE = Number(process.env.SHIPPING_FEE);
    const THRESHOLD_FREE_SHIPPING = Number(process.env.THRESHOLD_FREE_SHIPPING);

    const OrderItem_1 = {
      productId: 'DUMMY PRODUCT ID',
      productName: 'Test Product 1',
      imageURL: 'DUMMY IMAGE URL',
      price: 11,
      qty: 1,
      _id: 'DUMMY ID',
    };
    const OrderItem_2 = {
      productId: 'DUMMY PRODUCT ID',
      productName: 'Test Product 2',
      imageURL: 'DUMMY IMAGE URL',
      price: 45,
      qty: 2,
      _id: 'DUMMY ID',
    };
    const OrderItemArray = [OrderItem_1, OrderItem_2];
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } =
      calcPrices(OrderItemArray);

    expect(itemsPrice).toEqual(101);
    const expectedShippingFee =
      itemsPrice > THRESHOLD_FREE_SHIPPING ? 0 : SHIPPING_FEE;
    expect(shippingPrice).toEqual(expectedShippingFee);
    expect(taxPrice).toEqual(VAT_FRACTION * itemsPrice);
    expect(totalPrice).toEqual(itemsPrice + shippingPrice + taxPrice);
  });
});
