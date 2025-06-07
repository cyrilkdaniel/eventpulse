import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Avatar,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  changePassword,
  fetchProfileInfo,
  updateProfile,
} from "../services/userService";

const Profile = () => {
  const dispatch = useDispatch();

  // On mount fetch user profile info
  useEffect(() => {
    fetchProfileInfo(dispatch);
  }, [dispatch]);

  const isLoading = useSelector((state) => state.userReducer.isLoading);
  const user = useSelector((state) => state.userReducer.user);
  const genres = useSelector((state) => state.genreReducer.genres);
  // const [profile, setProfile] = useState(user);

  const [profile, setProfile] = useState(null); // Start with null

  useEffect(() => {
    if (user) {
      setProfile(user); // Update profile whenever user changes
    }
  }, [user]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // States for Toast messages
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Handle Snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setError(null);
    setSuccess(null);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(dispatch, profile);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccess("Password changed successfully!");
      setIsModalOpen(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to change password.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (isLoading || !profile) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
      padding={4}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 800,
          width: "100%",
          borderRadius: 2,
        }}
      >
        <Stack spacing={3}>
          {/* Profile Header */}
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "primary.main",
              }}
            >
              {profile.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {profile.username}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {profile.email}
              </Typography>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outlined"
                size="small"
                sx={{
                  textTransform: "none",
                  marginTop: 1,
                  color: "text.secondary",
                  fontWeight: "bold",
                }}
              >
                Change Password
              </Button>
            </Box>
          </Box>

          <Divider sx={{ marginY: 2 }} />

          {/* Form Fields */}
          <Typography variant="h6" fontWeight="bold">
            Update Profile Information
          </Typography>
          <TextField
            label="Name"
            value={profile.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={profile.email}
            fullWidth
            margin="normal"
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />

          {/* Interests Section */}
          <Typography variant="h6" fontWeight="bold">
            Interests and Preferences
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Interests</InputLabel>
            <Select
              multiple
              value={profile.interests}
              onChange={(e) =>
                setProfile({ ...profile, interests: e.target.value })
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={genres.find((genre) => genre._id === value).name}
                    />
                  ))}
                </Box>
              )}
            >
              {genres.map((genre) => (
                <MenuItem key={genre._id} value={genre._id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSaveProfile}
            sx={{
              marginTop: 3,
              fontWeight: "bold",
              paddingY: 1.5,
            }}
          >
            Save Changes
          </Button>
        </Stack>

        {/* Change Password Modal */}
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              label="Current Password"
              type="password"
              fullWidth
              margin="normal"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              margin="normal"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleChangePassword} color="primary">
              Save Password
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>

      {/* Success Snackbar */}
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

      {/* Error Snackbar */}
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

export default Profile;
