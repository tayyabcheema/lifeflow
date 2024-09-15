import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import { styled, useTheme } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(5),
  padding: theme.spacing(4),
  width: '100%',
  maxWidth: 550,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${theme.palette.primary.main}`,
}));

const EmailConfirmation = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const token = new URLSearchParams(location.search).get('token');
      try {
        const response = await axios.get(`https://lifeflow-server.up.railway.app/api/auth/verify-email?token=${token}`);
        setMessage(response.data.message);
        setLoading(false);
        setTimeout(() => {
          navigate("/LoginPage"); // Redirect to login page after a delay
        }, 5000);
      } catch (error) {
        setError('Error confirming email. Please try again later.');
        setLoading(false);
      }
    };

    confirmEmail();
  }, [location, navigate]);

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
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {message && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {message}
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Typography variant="h5" component="h1" gutterBottom textAlign="center" color="#3f51b5">
                Email Confirmation
              </Typography>
              {message && (
                <Typography variant="body1" component="p" textAlign="center" color="textSecondary">
                  Your email is confirmed successfully and your account is now activated. You will be redirected to the login page shortly.
                </Typography>
              )}
              {error && (
                <Typography variant="body1" component="p" textAlign="center" color="textSecondary">
                  Please try again later or contact support.
                </Typography>
              )}
            </>
          )}
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default EmailConfirmation;
