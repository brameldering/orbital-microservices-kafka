import React from 'react';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Alert,
} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { NextPageContext } from 'next';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import Meta from 'components/Meta';
import ErrorBlock from 'components/ErrorBlock';
import { parseError } from 'utils/parse-error';
import CheckoutSteps from 'components/CheckoutSteps';
import { H1_SHOPPING_CART } from 'constants/form-titles';
import { CURRENCY_SYMBOL } from 'constants/constants-frontend';
import {
  PRODUCTS_PAGE,
  SIGNIN_PAGE,
  SHIPPING_PAGE,
  PRODUCT_DETAIL_PAGE,
} from 'constants/client-pages';
import { ICartItem, IPriceCalcSettingsAttrs } from '@orbitelco/common';
import type { RootState } from 'slices/store';
import { addToCart, removeFromCart } from 'slices/cartSlice';
import { getPriceCalcSettings } from 'api/orders/get-price-calc-settings';

interface TPageProps {
  priceCalcSettings: IPriceCalcSettingsAttrs;
  error?: string[];
}

const CartScreen: React.FC<TPageProps> = ({ priceCalcSettings, error }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentPath = router.pathname;

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const addToCartHandler = (product: ICartItem, qty: number) => {
    dispatch(addToCart({ cartItem: { ...product, qty }, priceCalcSettings }));
  };

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart({ id, priceCalcSettings }));
  };

  const nextPage = SHIPPING_PAGE;
  const checkoutHandler = () => {
    if (userInfo?.name) {
      // user logged in, proceed to next page
      Router.push(nextPage);
    } else {
      // user not yet logged in, log in first then redirect to next page
      Router.push(`${SIGNIN_PAGE}?redirect=${nextPage}`);
    }
  };

  return (
    <>
      <Meta title={H1_SHOPPING_CART} />
      <CheckoutSteps currentStep={0} />
      {error ? (
        <ErrorBlock error={error} />
      ) : (
        <>
          <Row>
            <Col md={8}>
              <h1 style={{ marginBottom: '20px' }}>{H1_SHOPPING_CART}</h1>
              {cartItems.length === 0 ? (
                <Alert variant='info'>
                  Your cart is empty{' '}
                  <Link id='LINK_go_to_shop' href={PRODUCTS_PAGE}>
                    Go to shop
                  </Link>
                </Alert>
              ) : (
                <ListGroup variant='flush'>
                  {cartItems.map((item) => (
                    <ListGroup.Item id='product_item' key={item.productId}>
                      <Row>
                        <Col md={2}>
                          <Image
                            src={item.imageURL}
                            alt={item.productName}
                            fluid
                          />
                        </Col>
                        <Col md={4}>
                          <Link
                            id={`product_name_${item.productName}`}
                            href={`${PRODUCT_DETAIL_PAGE}/${item.productId}?goBackPath=${currentPath}`}>
                            {item.productName}
                          </Link>
                        </Col>
                        <Col md={2}>
                          {CURRENCY_SYMBOL}
                          {item.price.toFixed(2)}
                        </Col>
                        <Col md={2}>
                          <Form.Control
                            id={`select_quantity_${item.productName}`}
                            as='select'
                            value={item.qty}
                            onChange={(e) =>
                              addToCartHandler(item, Number(e.target.value))
                            }>
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                        <Col md={2}>
                          <Button
                            id={`remove_from_cart_${item.productName}`}
                            type='button'
                            variant='light'
                            onClick={() =>
                              removeFromCartHandler(item.productId)
                            }>
                            <FaTrash />
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h2>
                      Subtotal (
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                      items
                    </h2>
                    {CURRENCY_SYMBOL}
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      id='BUTTON_checkout'
                      type='button'
                      className='btn-block mt-2'
                      disabled={cartItems.length === 0}
                      onClick={checkoutHandler}>
                      Proceed To Checkout
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
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
  } catch (error) {
    const parsedError = parseError(error);
    return {
      props: { priceCalcSettings: {}, error: parsedError },
    };
  }
};

export default CartScreen;
