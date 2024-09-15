import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

const StyledCard = styled(Card)(({ theme }) => ({
  width: 600, 
  padding: theme.spacing(4),
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  borderRadius: theme.shape.borderRadius * 2,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  backgroundImage: "linear-gradient(to right, #3f51b5, #5a67d8)",
  color: "#fff",
  "&:hover": {
    backgroundImage: "linear-gradient(to right, #303f9f, #4a5db2)",
  },
}));

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Invalid email address";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setFormErrors({});
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("https://lifeflow-server.up.railway.app/api/auth/request-password-reset", { email });
      setMessage(response.data.message);
      setEmail("");
    } catch (error) {
      setError(error.response ? error.response.data.message : "An error occurred. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
        padding: 2,
      }}
    >
      <StyledCard>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Forget Password
          </Typography>
          <Typography variant="body1" component="p" gutterBottom textAlign="center">
            You will receive instructions for resetting your password.
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="Your Email Address"
              name="email"
              value={email}
              onChange={handleChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              variant="outlined"
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
              Send
            </StyledButton>
            <Button
              variant="text"
              fullWidth
              sx={{ mt: 2 }}
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

export default ForgetPassword;
