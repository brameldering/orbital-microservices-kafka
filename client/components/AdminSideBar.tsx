import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  IconButton,
  SvgIconProps,
  Typography,
  styled,
  Theme,
  useTheme,
  CSSObject,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import PeopleAllOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import Shop2OutlinedIcon from '@mui/icons-material/Shop2Outlined';
import {
  PRODUCTS_PAGE,
  PRODUCT_LIST_PAGE,
  USER_LIST_PAGE,
  ORDER_LIST_PAGE,
  ROLE_LIST_PAGE,
  API_ACCESS_LIST_PAGE,
  PRICE_CALC_VIEW_PAGE,
} from 'constants/client-pages';

const drawerWidth = 200;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
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
            }}>
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
        </ListItemButton>
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
        }}>
        <DrawerHeader>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            sx={{
              ...(open && { display: 'none' }),
              ml: 2,
              flexGrow: 1,
              textAlign: 'left',
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
            }}>
            Administration
          </Typography>
          <IconButton
            color='inherit'
            aria-label='close drawer'
            onClick={handleDrawerClose}
            sx={{
              ...(!open && { display: 'none' }),
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
            url={PRODUCTS_PAGE}
            open={open}
          />
          <Divider />
          <AdminListItem
            text='Products'
            icon={<CategoryOutlinedIcon />}
            url={PRODUCT_LIST_PAGE}
            open={open}
          />
          <AdminListItem
            text='Price Calculation'
            icon={<CalculateOutlinedIcon />}
            url={PRICE_CALC_VIEW_PAGE}
            open={open}
          />
          <Divider />
          <AdminListItem
            text='Users'
            icon={<PeopleAllOutlinedIcon />}
            url={USER_LIST_PAGE}
            open={open}
          />
          <AdminListItem
            text='Roles'
            icon={<PsychologyOutlinedIcon />}
            url={ROLE_LIST_PAGE}
            open={open}
          />
          <AdminListItem
            text='Role Access Rights'
            icon={<GppGoodOutlinedIcon />}
            url={API_ACCESS_LIST_PAGE}
            open={open}
          />
          <Divider />
          <AdminListItem
            text='Orders'
            icon={<Shop2OutlinedIcon />}
            url={ORDER_LIST_PAGE}
            open={open}
          />
          <Divider />
        </List>
      </Drawer>
    </Box>
  );
};

export default AdminSideBar;
