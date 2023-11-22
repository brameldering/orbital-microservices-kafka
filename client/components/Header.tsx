import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';
import Router from 'next/router';
import useRequest from 'hooks/use-request';
import { BASE_URL } from 'constants/constants-frontend';
import { SIGN_OUT_URL } from '@orbitelco/common';
import LogoSVG from '../logo/LogoSVG';
import ErrorBlock from './ErrorBlock';
import { useUserContext } from '../context/user-context';

interface THeaderProps {
  currentUser?: { name: string; email: string };
}

const Header: React.FC<THeaderProps> = ({ currentUser }) => {
  const { userContext, setUserContext } = useUserContext();

  const { doRequest, error: errorSigninOut } = useRequest({
    url: BASE_URL + SIGN_OUT_URL,
    method: 'post',
    onSuccess: () => Router.push('/'),
  });
  const logoutHandler = async () => {
    await doRequest({ body: {} });
    setUserContext(null);
  };

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='sm' collapseOnSelect>
        <Container style={{ marginLeft: '5px' }}>
          <Link href='/'>
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
                {currentUser?.name ? (
                  <>
                    <NavDropdown
                      title={userContext?.name || 'Unknown'}
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
