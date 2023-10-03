import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import type { RootState } from '../../store';

const PrivateRoute: React.FunctionComponent = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};
export default PrivateRoute;
