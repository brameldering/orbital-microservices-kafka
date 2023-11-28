import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import Router from 'next/router';
import LogoSVG from 'logo/LogoSVG';
import SearchBox from './SearchBox';
import ErrorBlock from './ErrorBlock';
import {
  PRODUCTS_PAGE,
  CART_PAGE,
  MY_PROFILE_PAGE,
  MY_ORDERS_PAGE,
  SIGNUP_PAGE,
  SIGNIN_PAGE,
  PRODUCT_LIST_PAGE,
  USER_LIST_PAGE,
  ORDER_LIST_PAGE,
} from 'constants/client-pages';
import type { RootState } from 'slices/store';
import { logout } from 'slices/authSlice';
import { useSignOutMutation } from 'slices/usersApiSlice';
import { ADMIN_ROLE } from '@orbitelco/common';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const [doSignOut, { error: errorSigninOut }] = useSignOutMutation();
  const logoutHandler = async () => {
    try {
      await doSignOut().unwrap();
      dispatch(logout());
      Router.push(PRODUCTS_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='sm' collapseOnSelect>
        <Container style={{ marginLeft: '5px' }}>
          <Link href={PRODUCTS_PAGE} passHref>
            <Navbar.Brand id='LINK_orbitelco_shop'>
              <LogoSVG />
              <Navbar.Text style={{ marginLeft: '10px', color: '#6aa0cb' }}>
                Orbitelco
              </Navbar.Text>
            </Navbar.Brand>{' '}
          </Link>
          <div className='d-flex justify-content-end'>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav className='ms-auto'>
                <SearchBox />
                <Nav.Link as={Link} href={CART_PAGE} id='LINK_header_cart'>
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
                {userInfo ? (
                  <>
                    <NavDropdown
                      title={userInfo.name}
                      id='LINK_header_username'>
                      <NavDropdown.Item
                        as={Link}
                        href={MY_PROFILE_PAGE}
                        id='LINK_my_profile'>
                        My Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        as={Link}
                        href={MY_ORDERS_PAGE}
                        id='LINK_my_orders'>
                        My Orders
                      </NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link id='LINK_header_logout' onClick={logoutHandler}>
                      Sign Out
                    </Nav.Link>
                    {errorSigninOut && <ErrorBlock error={errorSigninOut} />}
                  </>
                ) : (
                  <>
                    <Nav.Link
                      as={Link}
                      href={SIGNIN_PAGE}
                      id='LINK_header_sign_in'>
                      <FaUser /> Sign In
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      href={SIGNUP_PAGE}
                      id='LINK_header_sign_up'>
                      <FaUser /> Sign Up
                    </Nav.Link>
                  </>
                )}

                {/* Admin Links */}
                {userInfo?.role === ADMIN_ROLE && (
                  <NavDropdown title='Admin' id='LINK_header_adminmenu'>
                    <NavDropdown.Item
                      as={Link}
                      href={PRODUCT_LIST_PAGE}
                      id='LINK_header_products'>
                      Products
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      href={USER_LIST_PAGE}
                      id='LINK_header_users'>
                      Users
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      href={ORDER_LIST_PAGE}
                      id='LINK_header_orders'>
                      Orders
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
