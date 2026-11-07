
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import { toast } from "sonner";
import { getUserById, updateUser } from "../../api/userApi";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form state.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user"
  });

  // Fetch the selected user's existing information.
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: Boolean(id)
  });

  // Fill the form after the user data arrives.
  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data.user.name || "",
        email: data.user.email || "",
        role: data.user.role || "user"
      });
    }
  }, [data]);

  // Send updated information to the backend.
  const updateMutation = useMutation({
    mutationFn: updateUser,

    onSuccess: (response) => {
      toast.success(response.message || "User updated successfully");

      // Refresh the user list and selected user details.
      queryClient.invalidateQueries({
        queryKey: ["users"]
      });

      queryClient.invalidateQueries({
        queryKey: ["user", id]
      });

      navigate("/users");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Unable to update user"
      );
    }
  });

  // Update the changed form field.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  // Submit the form.
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    updateMutation.mutate({
      id,
      userData: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role
      }
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error?.response?.data?.message || "Unable to load user details"}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        Edit User
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Update the user's basic information and role.
      </Typography>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          maxWidth: 650,
          p: { xs: 2, sm: 3 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2
        }}
      >
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            required
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            required
            type="email"
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/users")}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

export default EditUser;
