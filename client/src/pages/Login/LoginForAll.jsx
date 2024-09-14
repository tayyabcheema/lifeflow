import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import image1 from "../../assets/contactUs.jpg";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Snackbar,
  Alert,
} from "@mui/material";

const LoginForAll = () => {
  const navigate = useNavigate();
  const [openCreateAccountDialog, setOpenCreateAccountDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCreateAccountRole, setSelectedCreateAccountRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      navigate("/DonorDashboard");
    }
  }, [navigate]);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    if (!email || !password || !selectedRole) {
      setErrorMessage("Please fill in all fields and select a role.");
      setSnackbarMessage("Please fill in all fields and select a role.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const loginUrl =
      selectedRole === "DonorDashboard"
        ? "http://localhost:8000/api/auth/donor/login"
        : "http://localhost:8000/api/auth/hospital/login";

    try {
      const response = await axios.post(loginUrl, { email, password });
      const { data } = response;
      setSnackbarMessage(data.message);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      const { accessToken, refreshToken, user } = data.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setTimeout(() => {
        navigate(`/${selectedRole}`);
      }, 1500);
    } catch (error) {
      const errorMsg = error.response ? error.response.data.message : "Login failed";
      setSnackbarMessage(errorMsg);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const createaccounthandleCancel = () => {
    setOpenCreateAccountDialog(false);
  };

  const handleRoleChange = (event) => {
    setSelectedCreateAccountRole(event.target.value);
  };

  const handleRoleChangeLogin = (event) => {
    setSelectedRole(event.target.value);
  };

  const createaccounthandleLogin = () => {
    switch (selectedCreateAccountRole) {
      case "Donor":
        navigate("/SignUpDonor");
        break;
      case "Hospital":
        navigate("/HospitalSignUp");
        break;
      default:
        break;
    }
    setOpenCreateAccountDialog(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ display: "flex", alignItems: "center", height: "100vh" }}
    >
      <Grid container>
        <Grid item md={6}>
          <Paper
            square
            sx={{
              bgcolor: "white",
              color: "black",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Box sx={{ width: "80%", height: "80%" }}>
              <img
                src={image1}
                alt="Contact Us"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item md={6}>
          <Paper
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box sx={{ p: 5, width: "100%" }}>
              <Typography variant="h4" gutterBottom textAlign="center">
                Login
              </Typography>
              <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                sx={{ mb: 3 }}
                error={errorMessage && !email}
                helperText={errorMessage && !email ? "Email is required" : ""}
              />
              <TextField
                fullWidth
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                sx={{ mb: 3 }}
                error={errorMessage && !password}
                helperText={errorMessage && !password ? "Password is required" : ""}
              />
              <FormControl component="fieldset" sx={{ mb: 3, textAlign: "left" }}>
                <FormLabel component="legend">Select Your Role</FormLabel>
                <RadioGroup
                  aria-label="role"
                  value={selectedRole}
                  onChange={handleRoleChangeLogin}
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="DonorDashboard"
                    control={<Radio />}
                    label="Donor"
                  />
                  <FormControlLabel
                    value="HospitalDashboard"
                    control={<Radio />}
                    label="Hospital"
                  />
                </RadioGroup>
                {errorMessage && !selectedRole && (
                  <Typography color="error" variant="body2">
                    Please select a role
                  </Typography>
                )}
              </FormControl>
              <Button
                fullWidth
                variant="contained"
                sx={{ py: 2, mb: 1 }}
                onClick={handleLogin}
              >
                Login
              </Button>
              <Button
                fullWidth
                color="secondary"
                onClick={() => navigate("/ForgetPassword")}
              >
                Forget Password
              </Button>
            </Box>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2">
                Don't have an account?
                <Button onClick={() => setOpenCreateAccountDialog(true)}>
                  Create Account
                </Button>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openCreateAccountDialog}
        onClose={createaccounthandleCancel}
      >
        <DialogTitle>Choose from below</DialogTitle>
        <DialogContent>
          <FormControl>
            <FormLabel>Select Your Role</FormLabel>
            <RadioGroup
              value={selectedCreateAccountRole}
              onChange={handleRoleChange}
              name="radio-buttons-group"
              sx={{ textAlign: "left" }}
            >
              <FormControlLabel
                value="Donor"
                control={<Radio />}
                label="Donor"
              />
              <FormControlLabel
                value="Hospital"
                control={<Radio />}
                label="Hospital"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={createaccounthandleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={createaccounthandleLogin} color="primary">
            SignUp
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginForAll;
