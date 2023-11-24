import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';
import Router from 'next/router';
import LogoSVG from 'logo/LogoSVG';
import ErrorBlock from './ErrorBlock';
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
      Router.push('/');
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='sm' collapseOnSelect>
        <Container style={{ marginLeft: '5px' }}>
          <Link href='/' passHref>
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
                        href='/auth/myprofile'
                        id='LINK_my_profile'>
                        My Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} href='/' id='LINK_my_orders'>
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
                      href='/auth/signin'
                      id='LINK_header_sign_in'>
                      <FaUser /> Sign In
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      href='/auth/signup'
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
