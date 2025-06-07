import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Button,
  Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../services/authService";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.authReducer.isLoggedIn);

  const onLogout = () => {
    const refreshToken = localStorage.getItem("refreshToken"); // Assuming you have stored refreshToken in localStorage
    logout(dispatch, refreshToken);
    navigate("/");
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar>
        {/* App Title */}
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Typography
            variant="h6"
            onClick={() => navigate("/")}
            sx={{ cursor: "pointer" }}
          >
            EventPulse
          </Typography>
        </Box>

        {/* User Actions */}
        {isLoggedIn ? (
          <>
            {/* Profile Icon */}
            <Tooltip title="Profile">
              <IconButton color="inherit" onClick={() => navigate("/profile")}>
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>

            {/* Reservations Icon */}
            <Tooltip title="Reservations">
              <IconButton
                color="inherit"
                onClick={() => navigate("/reservations")}
              >
                <EventNoteIcon />
              </IconButton>
            </Tooltip>

            {/* Calendar Icon */}
            <Tooltip title="Calendar">
              <IconButton color="inherit" onClick={() => navigate("/calendar")}>
                <CalendarTodayIcon />
              </IconButton>
            </Tooltip>

            {/* Logout Icon */}
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={onLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          // Login Button for Non-Logged-In Users
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
