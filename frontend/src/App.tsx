import React, { useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Footer from './components/footer/Footer';
import Header from './components/header/Header';
import { logout } from './slices/authSlice';

const App: React.FunctionComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const expirationTime: string | null =
      localStorage.getItem('expirationTime');
    if (expirationTime) {
      const expirationTimeNr: number = Number(expirationTime);
      const currentTime: number = new Date().getTime();

      if (!Number.isNaN(expirationTimeNr) && currentTime > expirationTimeNr) {
        dispatch(logout());
      }
    }
  }, [dispatch]);

  return (
    <React.Fragment>
      <ToastContainer autoClose={3000} />
      <Header />
      <main className='py-3'>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </React.Fragment>
  );
};

export default App;
