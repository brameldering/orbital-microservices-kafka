import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import { FaUser } from 'react-icons/fa';
import Router from 'next/router';
import LogoSVG from '../assets/LogoSVG';
import useRequest from 'hooks/use-request';

interface THeaderProps {
  currentUser?: { name: string; email: string };
}

const Header: React.FC<THeaderProps> = ({ currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: 'https://orbitelco.dev/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });
  const logoutHandler = async () => {
    await doRequest();
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
          {/* <div className='d-flex justify-content-end'> */}
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='d-flex justify-content-end'>
              {currentUser?.name ? (
                <>
                  <NavDropdown
                    title={currentUser.name}
                    id='LINK_header_username'>
                    <Link href='/'>
                      <NavDropdown.Item id='LINK_my_profile'>
                        My Profile
                      </NavDropdown.Item>
                    </Link>
                    <Link href='/'>
                      <NavDropdown.Item id='LINK_my_orders'>
                        My Orders
                      </NavDropdown.Item>
                    </Link>
                  </NavDropdown>
                  <Nav.Link id='LINK_header_logout' onClick={logoutHandler}>
                    Sign Out
                  </Nav.Link>
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
              {errors}
            </Nav>
          </Navbar.Collapse>
          {/* </div> */}
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
