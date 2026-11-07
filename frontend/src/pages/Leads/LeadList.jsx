
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography
} from "@mui/material";

import { toast } from "sonner";

import LeadFilters from "../../components/LeadFilters";
import LeadTable from "../../components/LeadTable";

import {
  useLeads,
  useDeleteLead
} from "../../hooks/useLeads";

function LeadList() {
  const navigate = useNavigate();

  // Keep the current page and filter values in component state.
  const [page, setPage] = useState(0);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    source: ""
  });

  // The backend uses page numbers starting from 1.
  // MUI TablePagination uses page numbers starting from 0.
  const queryParams = {
    page: page + 1,
    limit: 10,
    search: filters.search,
    status: filters.status,
    priority: filters.priority,
    source: filters.source,
    sortBy: "createdAt",
    sortOrder: "desc"
  };

  // Fetch leads whenever the page or filters change.
  const {
    data,
    isLoading,
    isError,
    error
  } = useLeads(queryParams);

  const deleteMutation = useDeleteLead();

  // Update filters and return to the first page.
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  // Ask for confirmation before deleting a lead.
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Lead deleted successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to delete lead"
      );
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Lead Management
          </Typography>

          <Typography color="text.secondary">
            Manage and track your leads.
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate("/leads/create")}
        >
          Add New Lead
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #E2E8F0"
        }}
      >
        <LeadFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </Paper>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error">
          {error.response?.data?.message || "Unable to load leads"}
        </Alert>
      ) : (
        <Paper
          elevation={0}
          sx={{ border: "1px solid #E2E8F0" }}
        >
          <LeadTable
            leads={data?.leads || []}
            totalLeads={data?.totalLeads || 0}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onView={(id) => navigate(`/leads/${id}`)}
            onEdit={(id) => navigate(`/leads/${id}/edit`)}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        </Paper>
      )}
    </Box>
  );
}

export default LeadList;
