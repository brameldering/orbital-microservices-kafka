import React from 'react';
import { Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

import LogoSVG from '../../assets/LogoSVG';
import { logout } from '../../slices/authSlice';
import { resetCart } from '../../slices/cartSlice';
import { useLogoutMutation } from '../../slices/usersApiSlice';
import type { RootState } from '../../store';

import SearchBox from './SearchBox';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand id='header-orbital-shop'>
              <LogoSVG />
              <span style={{ marginLeft: '10px' }}>Orbital Shop</span>
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <SearchBox />
              <LinkContainer to='/cart'>
                <Nav.Link id='header-cart'>
                  <FaShoppingCart /> Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id='header-username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item id='header-my-profile'>
                        My Profile
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/myorders'>
                      <NavDropdown.Item id='header-my-orders'>
                        My Orders
                      </NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item
                      id='header-logout'
                      onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {/* Admin Links */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='header-adminmenu'>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item id='header-products'>
                      Products
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item id='header-users'>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item id='header-orders'>
                      Orders
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
