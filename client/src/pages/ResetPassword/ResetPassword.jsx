import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import axios from "axios";

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(5),
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 550, // Increased width
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  borderRadius: theme.shape.borderRadius * 2, // More rounded corners
  border: `1px solid ${theme.palette.primary.main}`, // Border color
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  backgroundColor: "#3f51b5",
  "&:hover": {
    backgroundColor: "#303f9f",
  },
}));

const ResetPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    const errors = {};
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({});
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const token = new URLSearchParams(location.search).get("token");

    try {
      const response = await axios.post(`https://lifeflow-server.up.railway.app/api/auth/reset-password?token=${token}`, {
        newPassword: formData.password,
      });
      setMessage(response.data.message);
      setError("");
      setFormData({ password: "", confirmPassword: "" });
      setTimeout(() => {
        navigate("/LoginPage"); // Redirect to login page after successful reset
      }, 3000);
    } catch (error) {
      setError(error.response.data.message);
      setMessage("");
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
        padding: theme.spacing(2),
      }}
    >
      <StyledCard>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center" color="#3f51b5">
            Reset Password
          </Typography>
          <Typography variant="body1" component="p" gutterBottom textAlign="center" color="textSecondary">
            Please enter your new password.
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
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
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
            />
            {message && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <StyledButton type="submit" variant="contained" fullWidth>
              Reset Password
            </StyledButton>
            <Button
              variant="text"
              fullWidth
              sx={{ mt: 2, color: "#3f51b5" }}
              onClick={() => navigate("/LoginPage")}
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default ResetPassword;
