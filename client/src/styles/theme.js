import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D83F03",
    },
    secondary: {
      main: "#331005",
    },
    background: {
      default: "#F6F6E9",
      paper: "#F7F3E3",
    },
    text: {
      primary: "#010000",
      secondary: "#331005",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif", // You can change this to any font you prefer.
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Slightly rounded buttons
          textTransform: "none", // Avoid uppercase text for buttons
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#331005",
          color: "#F6F6E9",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#F7F3E3",
          color: "#010000",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for a sleek look
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          backgroundColor: "#F7F3E3", // Background for inputs
          borderRadius: 4,
          padding: "8px 12px",
        },
      },
    },
  },
});

export default theme;
