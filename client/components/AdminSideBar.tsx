import React, { useState, useEffect, ReactElement } from 'react';
import Link from 'next/link';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar'; //SubMenu
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { tokens } from '../theme';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

// import 'react-pro-sidebar/dist/css/styles.css';

import {
  PRODUCTS_PAGE,
  PRODUCT_LIST_PAGE,
  USER_LIST_PAGE,
  ORDER_LIST_PAGE,
  ROLE_LIST_PAGE,
  API_ACCESS_LIST_PAGE,
  PRICE_CALC_VIEW_PAGE,
} from 'constants/client-pages';

interface ItemProps {
  title: string;
  to: string;
  icon: ReactElement; // ReactElement type is used for JSX elements
  selected: string;
  // eslint-disable-next-line no-unused-vars
  setSelected: (title: string) => void;
}

const Item: React.FC<ItemProps> = ({
  title,
  to,
  icon,
  selected,
  setSelected,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode as 'light' | 'dark');
  return (
    <Link id={`LINK_${title.replace(/\s/g, '_')}`} href={to} passHref>
      <MenuItem
        active={selected === title}
        style={{ color: colors.grey[100] }}
        onClick={() => setSelected(title)}>
        {icon}
        <Typography>{title}</Typography>
      </MenuItem>
    </Link>
  );
};

const AdminSideBar: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('Dashboard');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {/* following ensures that this is only rendered on the client */}
      {isClient && (
        <Box
          sx={{
            '& .pro-sidebar-inner': {
              background: `${colors.primary[400]} !important`,
            },
            '& .pro-icon-wrapper': {
              backgroundColor: 'transparent !important',
            },
            '& .pro-inner-item': {
              padding: '5px 35px 5px 20px !important',
            },
            '& .pro-inner-item:hover': {
              color: '#868dfb !important',
            },
            '& .pro-menu-item.active': {
              color: '#6870fa !important',
            },
          }}>
          <Sidebar collapsed={isCollapsed}>
            <Menu>
              {/* icon='square' */}
              {/* LOGO AND MENU ICON */}
              <MenuItem
                onClick={() => setIsCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                style={{
                  margin: '10px 0 20px 0',
                  color: colors.grey[100],
                }}>
                {!isCollapsed && (
                  <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    ml='15px'>
                    <Typography variant='h3' color={colors.grey[100]}>
                      Administration
                    </Typography>
                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>
              {!isCollapsed && (
                <Box mb='25px'>
                  <Box textAlign='center'>
                    <Typography
                      variant='h4'
                      color={colors.grey[100]}
                      fontWeight='bold'
                      sx={{ m: '10px 0 0 0' }}>
                      Name of Admin
                    </Typography>
                  </Box>
                </Box>
              )}
              <Box paddingLeft={isCollapsed ? undefined : '10%'}>
                <Item
                  title='Shop'
                  to={PRODUCTS_PAGE}
                  icon={<HomeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant='h6'
                  color={colors.grey[300]}
                  sx={{ m: '15px 0 5px 20px' }}>
                  Products and Prices
                </Typography>
                <Item
                  title='Products'
                  to={PRODUCT_LIST_PAGE}
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title='Price Calculation'
                  to={PRICE_CALC_VIEW_PAGE}
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Typography
                  variant='h6'
                  color={colors.grey[300]}
                  sx={{ m: '15px 0 5px 20px' }}>
                  Users
                </Typography>
                <Item
                  title='Users'
                  to={USER_LIST_PAGE}
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title='Roles'
                  to={ROLE_LIST_PAGE}
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Item
                  title='Role Access Rights'
                  to={API_ACCESS_LIST_PAGE}
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Typography
                  variant='h6'
                  color={colors.grey[300]}
                  sx={{ m: '15px 0 5px 20px' }}>
                  Orders
                </Typography>

                <Item
                  title='Orders'
                  to={ORDER_LIST_PAGE}
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />

                <Typography
                  variant='h6'
                  color={colors.grey[300]}
                  sx={{ m: '15px 0 5px 20px' }}>
                  Various
                </Typography>

                <Item
                  title='Help'
                  to='\'
                  icon={<HelpOutlineOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </Box>
            </Menu>
          </Sidebar>
        </Box>
      )}
    </>
  );
};

export default AdminSideBar;
