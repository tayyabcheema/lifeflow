import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user data from local storage
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    handleClose();
    navigate("/LoginPage");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976D2' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}
        >
          Lifeflow
        </Typography>
        <Button color="inherit" component={Link} to="/" sx={{ color: 'white' }}>Home</Button>
        <Button color="inherit" component="a" href="#stats" sx={{ color: 'white' }}>Stats</Button>
        <Button color="inherit" component="a" href="#benefits" sx={{ color: 'white' }}>Benefits</Button>
        {/* <Button color="inherit" component="a" href="#users" sx={{ color: 'white' }}>Users</Button> */}
        <Button color="inherit" component="a" href="#about" sx={{ color: 'white' }}>Why Us</Button>
        <Button color="inherit" component="a" href="#contactus" sx={{ color: 'white' }}>Contact Us</Button>
        {user && (
          <>
            <IconButton
              edge="end"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{ color: 'white' }}
            >
              <AccountCircle />
              <Typography variant="body1" sx={{ ml: 1 }}>{user.name}</Typography>
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
