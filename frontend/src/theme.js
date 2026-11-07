import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#2563EB"
    },

    secondary: {
      main: "#64748B"
    },

    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF"
    },

    success: {
      main: "#16A34A"
    },

    error: {
      main: "#DC2626"
    }
  },

  typography: {
    fontFamily: "Inter, Arial, sans-serif",

    h4: {
      fontWeight: 700
    },

    h5: {
      fontWeight: 600
    },

    button: {
      textTransform: "none",
      fontWeight: 600
    }
  },

  shape: {
    borderRadius: 10
  }
});

export default theme;