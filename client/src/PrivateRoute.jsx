import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('user'); // Check if the user is authenticated

  return isAuthenticated ? children : <Navigate to="/LoginPage" />;
};

export default PrivateRoute;
