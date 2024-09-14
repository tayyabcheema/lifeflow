import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import axios from "axios";
import "./HospitalSignUp.css";

const cityOptions = ["Gujranwala", "Gujrat", "Mandi-Baha-Uddin"];

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(5),
  padding: theme.spacing(3),
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  position: 'relative',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  backgroundColor: "#3f51b5",
  "&:hover": {
    backgroundColor: "#303f9f",
  },
}));

const HospitalSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [registrationError, setRegistrationError] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      errors.name = "Name can only contain alphabets and spaces";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^((\+92)|(0))3\d{9}$/.test(formData.phone)) {
      errors.phone = "Invalid phone number";
    }
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city) errors.city = "City is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
    setRegistrationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("http://localhost:8000/api/auth/hospital/register", formData);
      if (response.status === 201) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          navigate("/LoginPage");
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setRegistrationError(error.response.data.message);
      } else {
        setRegistrationError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <StyledCard>
        {showSuccessMessage && (
          <Snackbar
            open={showSuccessMessage}
            autoHideDuration={6000}
            onClose={() => setShowSuccessMessage(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setShowSuccessMessage(false)} severity="success" sx={{ width: '100%' }}>
              Hospital registered successfully. Please check your email to verify your account.
            </Alert>
          </Snackbar>
        )}
        {registrationError && (
          <Snackbar
            open={!!registrationError}
            autoHideDuration={6000}
            onClose={() => setRegistrationError('')}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setRegistrationError('')} severity="error" sx={{ width: '100%' }}>
              {registrationError}
            </Alert>
          </Snackbar>
        )}
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Hospital SignUp Form
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!formErrors.address}
              helperText={formErrors.address}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>City</InputLabel>
              <Select
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={!!formErrors.city}
              >
                {cityOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.city && <Typography color="error">{formErrors.city}</Typography>}
            </FormControl>
            <StyledButton type="submit" variant="contained" fullWidth>
              Register
            </StyledButton>
          </form>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default HospitalSignUp;
