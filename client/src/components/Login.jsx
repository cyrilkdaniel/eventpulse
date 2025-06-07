import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../services/authService";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchProfileInfo } from "../services/userService";
import { fetchReservations } from "../services/reservationService";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(dispatch, credentials);
      setSuccess("Login successful!");
      setError(null);
      await fetchReservations(dispatch);

      // Redirect after a short delay
      setTimeout(() => {
        fetchProfileInfo(dispatch);
        navigate("/profile");
      }, 500);
    } catch (err) {
      const msg = err.message || err.errors[0]?.msg || "Invalid credentials";
      setError("Failed to log in: " + msg);
      setSuccess(null);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setError(null);
    setSuccess(null);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="background.default"
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          textAlign="center"
          gutterBottom
        >
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>
        <Box textAlign="center" marginTop={2}>
          <Typography variant="body2">
            Not registered?{" "}
            <Link
              component="button"
              onClick={() => navigate("/register")}
              color="primary"
            >
              Click here to register
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={!!success}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
