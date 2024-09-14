import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { refreshAccessToken, logout } from './store/authSlice';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Hospitals from './pages/Hospitals';
import Donors from './pages/Donors';
import Settings from './pages/Settings';
import BloodStock from './pages/BloodStock';
import Login from './pages/Login';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem('refreshToken')) {
      dispatch(refreshAccessToken());
    }

    const interval = setInterval(() => {
      dispatch(refreshAccessToken());
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="flex flex-col h-screen">
          {accessToken && <Header handleLogout={handleLogout} />}
          <div className="flex flex-1">
            {accessToken && <Sidebar />}
            <div className="flex flex-col flex-1 p-4 overflow-auto">
              <Routes>
                <Route
                  path="/login"
                  element={accessToken ? <Navigate to="/" /> : <Login />}
                />
                <Route
                  path="/"
                  element={accessToken ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                  path="/hospitals"
                  element={accessToken ? <Hospitals /> : <Navigate to="/login" />}
                />
                <Route
                  path="/donors"
                  element={accessToken ? <Donors /> : <Navigate to="/login" />}
                />
                <Route
                  path="/blood-stock"
                  element={accessToken ? <BloodStock /> : <Navigate to="/login" />}
                />
                <Route
                  path="/settings"
                  element={accessToken ? <Settings /> : <Navigate to="/login" />}
                />
              </Routes>
            </div>
          </div>
          {accessToken && <Footer />}
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
