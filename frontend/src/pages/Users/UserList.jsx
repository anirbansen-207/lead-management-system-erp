
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from "@mui/material";

import { toast } from "sonner";
import { getUsers, updateUserStatus } from "../../api/userApi";

function UserList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Backend pagination starts from page 1.
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  // Fetch users whenever the page or search value changes.
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () => getUsers({ page, limit, search }),
    placeholderData: (previousData) => previousData
  });

  // Activate/deactivate a user.
  const statusMutation = useMutation({
    mutationFn: updateUserStatus,

    onSuccess: (response) => {
      toast.success(response.message);

      // Refresh the user list after the status changes.
      queryClient.invalidateQueries({
        queryKey: ["users"]
      });
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Unable to update user status"
      );
    }
  });

  // Convert the Material UI zero-based page into backend's one-based page.
  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  // Ask for confirmation before changing account status.
  const handleStatusChange = (user) => {
    const action = user.isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    statusMutation.mutate({
      id: user._id,
      isActive: !user.isActive
    });
  };

  const users = data?.users || [];
  const totalUsers = data?.totalUsers || 0;

  return (
    <Box>
      {/* Page heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            User Management
          </Typography>

          <Typography color="text.secondary">
            Manage registered users and their account access.
          </Typography>
        </Box>
      </Stack>

      {/* Search field */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2
        }}
      >
        <TextField
          fullWidth
          size="small"
          label="Search users"
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearchChange}
        />
      </Paper>

      {/* Loading state */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error state */}
      {isError && (
        <Alert severity="error">
          {error?.response?.data?.message || "Unable to load users"}
        </Alert>
      )}

      {/* User table */}
      {!isLoading && !isError && (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden"
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>{user.name}</TableCell>

                      <TableCell>{user.email}</TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={user.role}
                          color={user.role === "admin" ? "primary" : "default"}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={user.isActive ? "Active" : "Inactive"}
                          color={user.isActive ? "success" : "default"}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <Button
                            size="small"
                            onClick={() =>
                              navigate(`/users/${user._id}/edit`)
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            size="small"
                            color={user.isActive ? "error" : "success"}
                            disabled={statusMutation.isPending}
                            onClick={() => handleStatusChange(user)}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination controls */}
          <TablePagination
            component="div"
            count={totalUsers}
            page={page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={limit}
            rowsPerPageOptions={[10]}
          />
        </Paper>
      )}
    </Box>
  );
}

export default UserList;
