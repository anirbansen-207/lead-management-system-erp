
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Pagination
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonIcon from "@mui/icons-material/Person";

import {
  getDashboardData,
  getDashboardUsers,
  getDashboardLeads,
  getSelectedUserLeads
} from "../../api/dashboardApi";

import useAuth from "../../hooks/useAuth";

const PAGE_SIZE = 5;

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Main dashboard data.
  const {
    data: dashboard,
    isLoading: dashboardLoading,
    isError: dashboardError
  } = useQuery({
    queryKey: ["dashboard", user?._id],
    queryFn: getDashboardData
  });

  const isAdmin = dashboard?.role === "admin";

  // Users table filters and pagination.
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [userStatus, setUserStatus] = useState("");

  // Recent leads table filters and pagination.
  const [leadPage, setLeadPage] = useState(1);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatus, setLeadStatus] = useState("");

  // Selected user dialog.
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogPage, setDialogPage] = useState(1);
  const [dialogSearch, setDialogSearch] = useState("");
  const [dialogStatus, setDialogStatus] = useState("");
  const [dialogPriority, setDialogPriority] = useState("");
  const [dialogSource, setDialogSource] = useState("");

  // Fetch users only for admin.
  const {
    data: usersData,
    isLoading: usersLoading
  } = useQuery({
    queryKey: ["dashboard-users", userPage, userSearch, userStatus],
    queryFn: () =>
      getDashboardUsers({
        page: userPage,
        limit: PAGE_SIZE,
        search: userSearch,
        status: userStatus
      }),
    enabled: isAdmin
  });

  // Fetch all system leads only for admin.
  const {
    data: leadsData,
    isLoading: leadsLoading
  } = useQuery({
    queryKey: ["dashboard-all-leads", leadPage, leadSearch, leadStatus],
    queryFn: () =>
      getDashboardLeads({
        page: leadPage,
        limit: PAGE_SIZE,
        search: leadSearch,
        status: leadStatus
      }),
    enabled: isAdmin
  });

  // Fetch selected user's leads only when the dialog is open.
  const {
    data: selectedUserLeadsData,
    isLoading: selectedUserLeadsLoading,
    isError: selectedUserLeadsError
  } = useQuery({
    queryKey: [
      "dashboard-selected-user-leads",
      selectedUser?._id,
      dialogPage,
      dialogSearch,
      dialogStatus,
      dialogPriority,
      dialogSource
    ],
    queryFn: () =>
      getSelectedUserLeads(selectedUser._id, {
        page: dialogPage,
        limit: PAGE_SIZE,
        search: dialogSearch,
        status: dialogStatus,
        priority: dialogPriority,
        source: dialogSource
      }),
    enabled: Boolean(isAdmin && selectedUser?._id)
  });

  // Open the selected user's lead dialog.
  const handleOpenUser = (selected) => {
    setSelectedUser(selected);
    setDialogPage(1);
    setDialogSearch("");
    setDialogStatus("");
    setDialogPriority("");
    setDialogSource("");
  };

  const handleCloseUser = () => {
    setSelectedUser(null);
  };

  // Reset pagination when a search or filter changes.
  const handleUserSearch = (value) => {
    setUserSearch(value);
    setUserPage(1);
  };

  const handleUserStatus = (value) => {
    setUserStatus(value);
    setUserPage(1);
  };

  const handleLeadSearch = (value) => {
    setLeadSearch(value);
    setLeadPage(1);
  };

  const handleLeadStatus = (value) => {
    setLeadStatus(value);
    setLeadPage(1);
  };

  const handleDialogSearch = (value) => {
    setDialogSearch(value);
    setDialogPage(1);
  };

  const handleDialogFilter = (setter) => (value) => {
    setter(value);
    setDialogPage(1);
  };

  const getStatusColor = (status) => {
    if (status === "Converted") return "success";
    if (status === "Lost") return "error";
    if (status === "Qualified") return "info";
    if (status === "Contacted") return "warning";
    return "default";
  };

  const getPriorityColor = (priority) => {
    if (priority === "High") return "error";
    if (priority === "Medium") return "warning";
    return "success";
  };

  if (dashboardLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (dashboardError) {
    return (
      <Alert severity="error">
        Unable to load dashboard data.
      </Alert>
    );
  }

  const users = usersData?.users || [];
  const allLeads = leadsData?.leads || [];
  const selectedLeads = selectedUserLeadsData?.leads || [];

  return (
    <Box>
      {/* Dashboard heading */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Welcome, {user?.name}
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {isAdmin
              ? "Overview of users and leads across the system."
              : "Overview of your leads."}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate("/leads")}
        >
          View Leads
        </Button>
      </Stack>

      {/* Summary cards */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        sx={{ mb: 3 }}
      >
        {isAdmin && (
          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary">
                    Total Users
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {dashboard?.totalUsers ?? 0}
                  </Typography>
                </Box>
                <PeopleAltIcon color="primary" sx={{ fontSize: 42 }} />
              </Stack>
            </CardContent>
          </Card>
        )}

        <Card
          elevation={0}
          sx={{
            flex: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2
          }}
        >
          <CardContent>
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary">
                  {isAdmin ? "Total Leads" : "My Total Leads"}
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                  {dashboard?.totalLeads ?? 0}
                </Typography>
              </Box>
              <PersonIcon color="primary" sx={{ fontSize: 42 }} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      {/* Admin-only users table */}
      {isAdmin && (
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden"
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Users and Their Leads
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Select a user's name to view their leads.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 2 }}
            >
              <TextField
                fullWidth
                size="small"
                label="Search by name or email"
                value={userSearch}
                onChange={(e) => handleUserSearch(e.target.value)}
              />

              <TextField
                select
                size="small"
                label="Account Status"
                value={userStatus}
                onChange={(e) => handleUserStatus(e.target.value)}
                sx={{ minWidth: 170 }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Stack>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                  <TableCell><strong>Lead Count</strong></TableCell>
                  <TableCell><strong>Account Status</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {usersLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        <Button
                          variant="text"
                          onClick={() => handleOpenUser(item)}
                          sx={{
                            p: 0,
                            minWidth: 0,
                            textTransform: "none",
                            fontWeight: 600
                          }}
                        >
                          {item.name}
                        </Button>
                      </TableCell>

                      <TableCell>{item.email}</TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={item.role}
                          color={item.role === "admin" ? "primary" : "default"}
                        />
                      </TableCell>

                      <TableCell>{item.leadCount}</TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={item.isActive ? "Active" : "Inactive"}
                          color={item.isActive ? "success" : "error"}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" sx={{ mr: 2 }}>
              {usersData?.totalUsers || 0} users
            </Typography>

            <Pagination
              count={Math.max(1, usersData?.totalPages || 1)}
              page={userPage}
              onChange={(_, value) => setUserPage(value)}
              color="primary"
            />
          </Stack>
        </Paper>
      )}

      {/* Recent leads table */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden"
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            {isAdmin
              ? "Recently Added Leads — All Users"
              : "My Recently Added Leads"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {isAdmin
              ? "Latest leads created across the system."
              : "Your latest leads."}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            <TextField
              fullWidth
              size="small"
              label="Search leads"
              value={isAdmin ? leadSearch : ""}
              onChange={(e) => handleLeadSearch(e.target.value)}
              disabled={!isAdmin}
            />

            <TextField
              select
              size="small"
              label="Lead Status"
              value={isAdmin ? leadStatus : ""}
              onChange={(e) => handleLeadStatus(e.target.value)}
              sx={{ minWidth: 170 }}
              disabled={!isAdmin}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Converted">Converted</MenuItem>
              <MenuItem value="Lost">Lost</MenuItem>
            </TextField>
          </Stack>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Company</strong></TableCell>

                {isAdmin && (
                  <TableCell><strong>Created By</strong></TableCell>
                )}

                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Priority</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(isAdmin ? leadsLoading : false) ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 6} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : (
                (isAdmin ? allLeads : dashboard?.recentLeads || []).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} align="center">
                      No leads found.
                    </TableCell>
                  </TableRow>
                ) : (
                  (isAdmin ? allLeads : dashboard?.recentLeads || []).map((lead) => (
                    <TableRow key={lead._id} hover>
                      <TableCell>
                        <Typography fontWeight={600}>
                          {lead.name}
                        </Typography>
                      </TableCell>

                      <TableCell>{lead.company || "—"}</TableCell>

                      {isAdmin && (
                        <TableCell>
                          {lead.createdBy?.name || "Unknown"}
                        </TableCell>
                      )}

                      <TableCell>{lead.email || "—"}</TableCell>
                      <TableCell>{lead.phone || "—"}</TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={lead.status}
                          color={getStatusColor(lead.status)}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={lead.priority}
                          color={getPriorityColor(lead.priority)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {isAdmin && (
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="body2" sx={{ mr: 2 }}>
              {leadsData?.totalLeads || 0} leads
            </Typography>

            <Pagination
              count={Math.max(1, leadsData?.totalPages || 1)}
              page={leadPage}
              onChange={(_, value) => setLeadPage(value)}
              color="primary"
            />
          </Stack>
        )}
      </Paper>

      {/* Selected user's leads dialog */}
      <Dialog
        open={Boolean(selectedUser)}
        onClose={handleCloseUser}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {selectedUser?.name}'s Leads
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {selectedUser?.email}
              </Typography>
            </Box>

            <IconButton onClick={handleCloseUser}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent dividers>
          {/* Filters for the selected user's leads */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <TextField
              fullWidth
              size="small"
              label="Search name, email, phone or company"
              value={dialogSearch}
              onChange={(e) => handleDialogSearch(e.target.value)}
            />

            <TextField
              select
              size="small"
              label="Status"
              value={dialogStatus}
              onChange={(e) =>
                handleDialogFilter(setDialogStatus)(e.target.value)
              }
              sx={{ minWidth: 140 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Contacted">Contacted</MenuItem>
              <MenuItem value="Qualified">Qualified</MenuItem>
              <MenuItem value="Converted">Converted</MenuItem>
              <MenuItem value="Lost">Lost</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Priority"
              value={dialogPriority}
              onChange={(e) =>
                handleDialogFilter(setDialogPriority)(e.target.value)
              }
              sx={{ minWidth: 130 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Source"
              value={dialogSource}
              onChange={(e) =>
                handleDialogFilter(setDialogSource)(e.target.value)
              }
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Website">Website</MenuItem>
              <MenuItem value="Referral">Referral</MenuItem>
              <MenuItem value="Social Media">Social Media</MenuItem>
              <MenuItem value="Advertisement">Advertisement</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Stack>

          {selectedUserLeadsError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Unable to load this user's leads.
            </Alert>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Company</strong></TableCell>
                  <TableCell><strong>Source</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Priority</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {selectedUserLeadsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : selectedLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No leads found for this user.
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedLeads.map((lead) => (
                    <TableRow key={lead._id} hover>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.email || "—"}</TableCell>
                      <TableCell>{lead.phone || "—"}</TableCell>
                      <TableCell>{lead.company || "—"}</TableCell>
                      <TableCell>{lead.source}</TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={lead.status}
                          color={getStatusColor(lead.status)}
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={lead.priority}
                          color={getPriorityColor(lead.priority)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <Typography variant="body2" color="text.secondary">
              {selectedUserLeadsData?.totalLeads || 0} leads
            </Typography>

            <Pagination
              count={Math.max(
                1,
                selectedUserLeadsData?.totalPages || 1
              )}
              page={dialogPage}
              onChange={(_, value) => setDialogPage(value)}
              color="primary"
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Dashboard;
