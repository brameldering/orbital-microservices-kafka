import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';
import Router from 'next/router';
import LogoSVG from 'logo/LogoSVG';
import ErrorBlock from './ErrorBlock';
import {
  INDEX_PAGE,
  MY_PROFILE_PAGE,
  MY_ORDERS_PAGE,
  SIGNUP_PAGE,
  SIGNIN_PAGE,
} from 'constants/client-pages';
import type { RootState } from 'slices/store';
import { logout } from 'slices/authSlice';
import { useSignOutMutation } from 'slices/usersApiSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [doSignOut, { error: errorSigninOut }] = useSignOutMutation();
  const logoutHandler = async () => {
    try {
      await doSignOut().unwrap();
      dispatch(logout());
      Router.push(INDEX_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='sm' collapseOnSelect>
        <Container style={{ marginLeft: '5px' }}>
          <Link href={INDEX_PAGE} passHref>
            <Navbar.Brand id='LINK_orbitelco_shop'>
              <LogoSVG />
              <Navbar.Text style={{ marginLeft: '10px', color: '#6aa0cb' }}>
                Orbitelco Shop
              </Navbar.Text>
            </Navbar.Brand>{' '}
          </Link>
          <div className='d-flex justify-content-end'>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Nav>
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
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
