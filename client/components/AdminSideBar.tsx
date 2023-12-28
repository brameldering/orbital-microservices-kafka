import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import Meta from 'components/Meta';
import FormTitle from 'form/FormTitle';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

// import 'react-pro-sidebar/dist/css/styles.css';

import { PRODUCTS_PAGE } from 'constants/client-pages';

const AdminSideBar: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {/* <Meta title='Orbitelco' /> */}
      {/* following ensures that this is only rendered on the client */}
      {isClient && (
        <Sidebar>
          <FormTitle>Admin</FormTitle>
          <Menu>
            <MenuItem>
              <Link
                legacyBehavior
                id='LINK_products_page'
                href={PRODUCTS_PAGE}
                passHref>
                <a style={{ textDecoration: 'none' }}>Orbitelco Shop</a>
              </Link>
            </MenuItem>
            <SubMenu label='Product Admin'>
              <MenuItem> Pie charts </MenuItem>
              <MenuItem> Line charts </MenuItem>
            </SubMenu>
            <MenuItem> Calendar </MenuItem>
          </Menu>
        </Sidebar>
      )}
    </>
  );
};

export default AdminSideBar;
