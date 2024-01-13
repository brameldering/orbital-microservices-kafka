/* eslint-disable react/prop-types */
import React from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppProps } from 'next/app';
import { HelmetProvider } from 'react-helmet-async';
import AdminSideBar from 'components/AdminSideBar';
import TopBar from 'components/TopBar';
import Footer from 'components/Footer';
// import Grid from '@mui/material/Grid';
import { Container } from '@mui/material';
import type { RootState } from 'slices/store';
import { ADMIN_ROLE } from '@orbital_app/common';

// Potentially add automatic logout based on expiration time
// See useEffect in frontend App.tsx

// eslint-disable-next-line no-unused-vars
const Content = ({ Component, pageProps, router }: AppProps) => {
  // const [isSidebar, setIsSidebar] = useState(true);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <HelmetProvider>
      <ToastContainer autoClose={2500} />
      <div className='app'>
        {userInfo && userInfo.role === ADMIN_ROLE && <AdminSideBar />}
        <main className='content'>
          <div className='MuiContainer-maxWidthLg' style={{ maxWidth: 1200 }}>
            <TopBar />
          </div>
          <Container sx={{ mx: 2, my: 2 }}>
            <Component {...pageProps} />
            <Footer />
          </Container>
        </main>
      </div>
    </HelmetProvider>
  );
};

export default Content;
