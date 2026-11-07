
import { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
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
import { resetPassword } from "../../api/authApi";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[0-9]{6}$/.test(otp)) {
      toast.error("Enter a valid six-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({
        email,
        otp,
        newPassword
      });

      toast.success(response.message);

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Password reset failed"
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
            Reset Password
          </Typography>

          <Typography color="text.secondary" mb={3}>
            Enter the OTP sent to your email and choose a new password.
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

            <TextField
              label="Six-digit OTP"
              fullWidth
              required
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputProps={{ maxLength: 6, inputMode: "numeric" }}
              margin="normal"
            />

            <TextField
              label="New Password"
              type="password"
              fullWidth
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              inputProps={{ minLength: 8, maxLength: 128 }}
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
