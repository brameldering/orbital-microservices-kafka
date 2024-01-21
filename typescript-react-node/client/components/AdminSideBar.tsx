import React, { useState } from 'react';
import Link from 'next/link';
import {
  SvgIconProps,
  CSSObject,
  styled,
  Theme,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MuiDrawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import PeopleAllOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import Shop2OutlinedIcon from '@mui/icons-material/Shop2Outlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PAGES from 'constants/client-pages';

const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '3px 0 4px -2px rgba(255,255,255,0.2)'
      : '3px 0 4px -2px rgba(0,0,0,0.2)',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '2px 0 4px -2px rgba(255,255,255,0.2)'
      : '2px 0 4px -2px rgba(0,0,0,0.2)',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

interface AdminListItemProps {
  text: string;
  icon: React.ReactElement<SvgIconProps>;
  url: string;
  open: boolean;
}

const AdminListItem: React.FC<AdminListItemProps> = ({
  text,
  icon,
  url,
  open,
}) => {
  return (
    <ListItem key={text} disablePadding sx={{ display: 'block' }}>
      <Link href={url} passHref>
        <span style={{ textDecoration: 'none' }}>
          {' '}
          {/* Removes underline from the link */}
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}>
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: 'rgb(255, 255, 255)',
              }}>
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={text}
              sx={{
                opacity: open ? 1 : 0,
                '.MuiTypography-root': {
                  color: 'rgb(255, 255, 255)',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                },
              }}
            />
          </ListItemButton>
        </span>
      </Link>
    </ListItem>
  );
};

const AdminSideBar: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant='permanent'
        open={open}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          color: 'rgb(255, 255, 255)',
        }}>
        <DrawerHeader>
          <IconButton
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            sx={{
              ...(open && { display: 'none' }),
              ml: 2,
              flexGrow: 1,
              textAlign: 'left',
              color: 'rgb(255, 255, 255)',
            }}>
            {theme.direction === 'rtl' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
          <Typography
            variant='h5'
            sx={{
              ...(!open && { display: 'none' }),
              ml: 2,
              flexGrow: 1,
              textAlign: 'left',
              color: 'rgb(255, 255, 255)',
            }}>
            Administration
          </Typography>
          <IconButton
            aria-label='close drawer'
            onClick={handleDrawerClose}
            sx={{
              ...(!open && { display: 'none' }),
              color: 'rgb(255, 255, 255)',
            }}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <AdminListItem
            text='Shop'
            icon={<HomeOutlinedIcon />}
            url={PAGES.PRODUCTS_PAGE}
            open={open}
          />
          <Divider />
          <AdminListItem
            text='Products'
            icon={<CategoryOutlinedIcon />}
            url={PAGES.PRODUCT_LIST_PAGE}
            open={open}
          />
          <AdminListItem
            text='Price Calculation'
            icon={<CalculateOutlinedIcon />}
            url={PAGES.PRICE_CALC_VIEW_PAGE}
            open={open}
          />
          <Divider />
          <AdminListItem
            text='Users'
            icon={<PeopleAllOutlinedIcon />}
            url={PAGES.USER_LIST_PAGE}
            open={open}
          />
          <AdminListItem
            text='Roles'
            icon={<PsychologyOutlinedIcon />}
            url={PAGES.ROLE_LIST_PAGE}
            open={open}
          />
          <AdminListItem
            text='Role Access Rights'
            icon={<GppGoodOutlinedIcon />}
            url={PAGES.API_ACCESS_LIST_PAGE}
            open={open}
          />
          <Divider />
          <AdminListItem
            text='Orders'
            icon={<Shop2OutlinedIcon />}
            url={PAGES.ORDER_LIST_PAGE}
            open={open}
          />
          <Divider />
          <AdminListItem
            text='Inventory'
            icon={<Inventory2OutlinedIcon />}
            url={PAGES.INVENTORY_LIST_PAGE}
            open={open}
          />
          <Divider />
        </List>
      </Drawer>
    </Box>
  );
};

export default AdminSideBar;
