import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "sonner";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      await login(formData);

      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={1} sx={{ width: "100%", p: 4, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Lead Management system ERP
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign in to your account
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, py: 1.2 }}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
            <Box display="flex" justifyContent="flex-end" mt={1}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                underline="hover"
              >
                Forgot Password?
              </Link>
            </Box>
          </Box>

          <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
            Don't have an account?{" "}
            <RouterLink to="/register">Register</RouterLink>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
