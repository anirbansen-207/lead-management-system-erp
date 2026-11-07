
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Link
} from "@mui/material";
import { toast } from "sonner";
import { forgotPassword } from "../../api/authApi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await forgotPassword(email);

      toast.success(response.message);

      navigate("/reset-password", {
        state: { email }
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 440 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={1}>
            Forgot Password
          </Typography>

          <Typography color="text.secondary" mb={3}>
            Enter your registered email address to receive a password
            reset OTP.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </Box>

          <Box textAlign="center" mt={3}>
            <Link component={RouterLink} to="/login" underline="hover">
              Back to Login
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ForgotPassword;
