import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import App from './App';
import AdminRoute from './components/authorization/AdminRoute';
import PrivateRoute from './components/authorization/PrivateRoute';
import NotFound from './components/general/NotFound';
import reportWebVitals from './reportWebVitals';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import UserListScreen from './screens/admin/UserListScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/order/CartScreen';
import OrderScreen from './screens/order/OrderScreen';
import PaymentScreen from './screens/order/PaymentScreen';
import PlaceOrderScreen from './screens/order/PlaceOrderScreen';
import ShippingScreen from './screens/order/ShippingScreen';
import ProductScreen from './screens/product/ProductScreen';
import ChangePasswordScreen from './screens/user/ChangePasswordScreen';
import LoginScreen from './screens/user/LoginScreen';
import MyOrdersScreen from './screens/user/MyOrdersScreen';
import PasswordResetConfirmationScreen from './screens/user/PasswordResetConfirmationScreen';
import PasswordResetScreen from './screens/user/PasswordResetScreen';
import ProfileScreen from './screens/user/ProfileScreen';
import RegisterScreen from './screens/user/RegisterScreen';
import store from './store';

import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route
        path='/search/:keyword/page/:pageNumber'
        element={<HomeScreen />}
      />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/passwordreset' element={<PasswordResetScreen />} />
      <Route
        path='/passwordresetconfirmation'
        element={<PasswordResetConfirmationScreen />}
      />

      {/* Registered users */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/password' element={<ChangePasswordScreen />} />
        <Route path='/myorders' element={<MyOrdersScreen />} />
      </Route>
      {/* Admin users */}
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/productlist' element={<ProductListScreen />} />
        <Route
          path='/admin/productlist/:pageNumber'
          element={<ProductListScreen />}
        />
        <Route path='/admin/product/:id/edit' element={<ProductEditScreen />} />

        <Route path='/admin/userlist' element={<UserListScreen />} />
        <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />

        <Route path='/admin/orderlist' element={<OrderListScreen />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

const payPalOptions = {
  clientId: 'DUMMY',
};

const container = document.getElementById('root') as HTMLFormElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true} options={payPalOptions}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
