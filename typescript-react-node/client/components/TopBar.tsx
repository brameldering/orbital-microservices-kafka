import React, { useState, useContext, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { ColorModeContext } from '../styles/theme'; // tokens
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

  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [doSignOut] = useSignOutMutation();
  const handleLogout = async () => {
    try {
      handleMenuClose();
      await doSignOut().unwrap();
      dispatch(logout());
      Router.push(PAGES.PRODUCTS_PAGE);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
  };

  // Generic handle redirect to page function that also closes floating menu
  const handleRedirect = async (page: string) => {
    try {
      handleMenuClose();
      Router.push(page);
    } catch (err: any) {
      // To avoid "Uncaught in promise" errors in console, errors are handled by RTK mutation
    }
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
      <MenuItem onClick={() => handleRedirect(PAGES.MY_PROFILE_PAGE)}>
        My profile
      </MenuItem>
      <MenuItem onClick={() => handleRedirect(PAGES.MY_ORDERS_PAGE)}>
        My orders
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
      <MenuItem onClick={() => handleRedirect(PAGES.SIGNIN_PAGE)}>
        Sign in
      </MenuItem>
      <MenuItem onClick={() => handleRedirect(PAGES.SIGNUP_PAGE)}>
        Sign up
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
            id='LINK_orbital_shop'
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
                id='LINK_orbital_shop'
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
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: 'green', // Set the background color
                        color: 'white', // Optional: change text color if needed
                      },
                    }}>
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
