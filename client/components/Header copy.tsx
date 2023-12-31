import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Link as MuiLink } from '@mui/material';
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
  // PRODUCT_LIST_PAGE,
  // USER_LIST_PAGE,
  // ORDER_LIST_PAGE,
  // ROLE_LIST_PAGE,
  // API_ACCESS_LIST_PAGE,
  // PRICE_CALC_VIEW_PAGE,
} from 'constants/client-pages';
import type { RootState } from 'slices/store';
import { logout } from 'slices/authSlice';
import { useSignOutMutation } from 'slices/usersApiSlice';
// import { ADMIN_ROLE } from '@orbitelco/common';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  // State and logic for menu handling
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';

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
    <AppBar position='static' color='primary'>
      <Container>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            onClick={handleProfileMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Link
            legacyBehavior
            id='LINK_orbitelco_shop'
            href={PRODUCTS_PAGE}
            passHref>
            <a
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <LogoSVG />
              <Typography variant='h3' noWrap sx={{ ml: 1 }}>
                Orbitelco
              </Typography>
            </a>
          </Link>
          <SearchBox />
          <div style={{ flexGrow: 1 }} />

          <IconButton color='inherit'>
            <Link
              legacyBehavior
              id='LINK_orbitelco_shop'
              href={CART_PAGE}
              passHref>
              <a
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  color: 'inherit',
                }}>
                <Badge
                  badgeContent={cartItems.reduce((a, c) => a + c.qty, 0)}
                  color='secondary'>
                  <ShoppingCartIcon />
                </Badge>
              </a>
            </Link>
          </IconButton>

          {/* Menu for user/admin dropdown */}
          <Menu
            id={menuId}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}>
            {/* {userInfo ? (
              <>
                <IconButton
                  size='large'
                  edge='end'
                  aria-label='account of current user'
                  aria-controls={menuId}
                  aria-haspopup='true'
                  onClick={handleProfileMenuOpen}
                  color='inherit'>
                  <AccountCircleIcon />
                </IconButton>
                <MenuItem onClick={handleMenuClose}>
                  <Link href={MY_PROFILE_PAGE} passHref>
                    <Typography variant='body1' component='a'>
                      My Profile
                    </Typography>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <Link href={MY_ORDERS_PAGE} passHref>
                    <Typography variant='body1' component='a'>
                      My Orders
                    </Typography>
                  </Link>
                </MenuItem>
                <IconButton
                  size='large'
                  edge='end'
                  aria-label='sign out'
                  onClick={logoutHandler}
                  color='inherit'>
                  <Typography variant='body1'>Sign Out</Typography>
                </IconButton>
                {errorSigninOut && <ErrorBlock error={errorSigninOut} />}
              </>
            ) : (
              <>
                <IconButton color='inherit'>
                  <Link href={SIGNIN_PAGE} passHref>
                    <Typography variant='body1' component='a'>
                      <AccountCircleIcon /> Sign In
                    </Typography>
                  </Link>
                </IconButton>
                <IconButton color='inherit'>
                  <Link href={SIGNUP_PAGE} passHref>
                    <Typography variant='body1' component='a'>
                      <AccountCircleIcon /> Sign Up
                    </Typography>
                  </Link>
                </IconButton>
              </>
            )} */}

            {/* Admin Links */}
            {/* {userInfo?.role === ADMIN_ROLE && (
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
                    <NavDropdown.Item
                      as={Link}
                      href={ROLE_LIST_PAGE}
                      id='LINK_header_roles'>
                      Roles
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      href={API_ACCESS_LIST_PAGE}
                      id='LINK_header_apiAccess'>
                      Api Access Rights
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      as={Link}
                      href={PRICE_CALC_VIEW_PAGE}
                      id='LINK_header_priceCalc'>
                      Price Calculation
                    </NavDropdown.Item>
                  </NavDropdown>
                )} */}
          </Menu>
          {errorSigninOut && <ErrorBlock error={errorSigninOut} />}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
