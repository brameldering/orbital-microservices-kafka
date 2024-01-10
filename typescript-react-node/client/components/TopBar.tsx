import React, { useState, useContext, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Link as MuiLink,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { ColorModeContext } from '../styles/theme'; // tokens
import {
  AccountCircle,
  DarkModeOutlined,
  LightModeOutlined,
  ShoppingCart,
} from '@mui/icons-material';
import Link from 'next/link';
import Router from 'next/router';
import LogoSVG from 'logo/LogoSVG';
import SearchBox from './SearchBox';
import PAGES from 'constants/client-pages';
import type { RootState } from 'slices/store';
import { logout } from 'slices/authSlice';
import { useSignOutMutation } from 'slices/usersApiSlice';

const TopBar: React.FC = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const [doSignOut] = useSignOutMutation();
  const handleLogout = async () => {
    try {
      setAnchorEl(null);
      await doSignOut().unwrap();
      dispatch(logout());
      Router.push(PAGES.PRODUCTS_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  const theme = useTheme();
  // const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuIdLoggedIn = 'account-menu-logged-in';
  const renderMenuLoggedIn = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuIdLoggedIn}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}>
      <MenuItem onClick={handleMenuClose}>
        <Link href={PAGES.MY_PROFILE_PAGE} passHref>
          <Typography
            variant='body1'
            component='a'
            sx={{ textDecoration: 'none' }}>
            My profile
          </Typography>
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link href={PAGES.MY_ORDERS_PAGE} passHref>
          <Typography
            variant='body1'
            component='a'
            sx={{ textDecoration: 'none' }}>
            My orders
          </Typography>
        </Link>
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <Typography variant='body1'>Sign out</Typography>
      </MenuItem>
    </Menu>
  );

  const menuIdNotLoggedIn = 'account-menu-not-logged-in';
  const renderMenuNotLoggedIn = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuIdNotLoggedIn}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}>
      <MenuItem onClick={handleMenuClose}>
        <Link href={PAGES.SIGNIN_PAGE} passHref>
          <Typography
            variant='body1'
            component='a'
            sx={{ textDecoration: 'none' }}>
            Sign in
          </Typography>
        </Link>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Link href={PAGES.SIGNUP_PAGE} passHref>
          <MuiLink sx={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant='body1'>Sign up</Typography>
          </MuiLink>
        </Link>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          {/* Logo */}
          <Link
            legacyBehavior
            id='LINK_orbitelco_shop'
            href={PAGES.PRODUCTS_PAGE}
            passHref>
            <a
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
              }}>
              <LogoSVG />
              <Typography
                variant='h3'
                noWrap
                component='div'
                sx={{
                  ml: 1,
                  color: 'inherit',
                  display: { xs: 'none', sm: 'block' },
                }}>
                Orbital
              </Typography>
            </a>
          </Link>
          {/* Search Box */}
          <SearchBox />
          {/* Spacex */}
          <Box sx={{ flexGrow: 1 }} />
          {/* Icons */}
          {/* ==================================================== */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* SHopping Cart*/}
            <IconButton size='large' aria-label='shopping cart' color='inherit'>
              <Link
                legacyBehavior
                id='LINK_orbitelco_shop'
                href={PAGES.CART_PAGE}
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
                    <ShoppingCart />
                  </Badge>
                </a>
              </Link>
            </IconButton>
            {/* ==================================================== */}
            <IconButton
              size='large'
              aria-label='user account'
              aria-controls={menuIdLoggedIn}
              aria-haspopup='true'
              color='inherit'
              onClick={handleProfileMenuOpen}>
              <AccountCircle />
            </IconButton>
            {/* ==================================================== */}
            <IconButton
              size='large'
              edge='end'
              aria-label='light dark mode'
              aria-controls='menu-light-dark-mode'
              aria-haspopup='true'
              color='inherit'
              onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === 'dark' ? (
                <LightModeOutlined />
              ) : (
                <DarkModeOutlined />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {userInfo ? renderMenuLoggedIn : renderMenuNotLoggedIn}
    </Box>
  );
};

export default TopBar;
