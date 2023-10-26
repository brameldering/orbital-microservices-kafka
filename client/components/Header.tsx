import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
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
          <Navbar.Brand href='/' id='LINK_orbitelco_shop'>
            <LogoSVG />
            <Navbar.Text style={{ marginLeft: '10px', color: '#6aa0cb' }}>
              Orbitelco Shop
            </Navbar.Text>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {currentUser?.name ? (
                <>
                  <NavDropdown
                    title={currentUser.name}
                    id='LINK_header_username'>
                    <NavDropdown.Item href='/' id='LINK_my_profile'>
                      My Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item href='/' id='LINK_my_orders'>
                      My Orders
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link id='LINK_header_logout' onClick={logoutHandler}>
                    Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link href='/auth/signin' id='LINK_header_sign_in'>
                    <FaUser /> Sign In
                  </Nav.Link>
                  <Nav.Link href='/auth/signup' id='LINK_header_sign_up'>
                    <FaUser /> Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
            {errors}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
