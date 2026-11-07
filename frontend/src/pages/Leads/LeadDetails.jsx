
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Typography
} from "@mui/material";

import { useLead } from "../../hooks/useLeads";

function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error
  } = useLead(id);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        {error.response?.data?.message || "Unable to load lead"}
      </Alert>
    );
  }

  const lead = data?.lead;

  if (!lead) {
    return <Alert severity="warning">Lead not found.</Alert>;
  }

  return (
    <Box>
      <Button onClick={() => navigate("/leads")} sx={{ mb: 2 }}>
        Back to Leads
      </Button>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Lead Details
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate(`/leads/${id}/edit`)}
        >
          Edit Lead
        </Button>
      </Box>

      <Card elevation={0} sx={{ border: "1px solid #E2E8F0" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {lead.name}
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
            <Chip label={lead.status} />
            <Chip
              label={`Priority: ${lead.priority}`}
              color={
                lead.priority === "High"
                  ? "error"
                  : lead.priority === "Medium"
                    ? "warning"
                    : "success"
              }
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary" variant="body2">
                Email
              </Typography>
              <Typography>{lead.email || "Not provided"}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary" variant="body2">
                Phone
              </Typography>
              <Typography>{lead.phone}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary" variant="body2">
                Company
              </Typography>
              <Typography>{lead.company || "Not provided"}</Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary" variant="body2">
                Source
              </Typography>
              <Typography>{lead.source}</Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography color="text.secondary" variant="body2">
                Notes
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {lead.notes || "No notes available"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary" variant="body2">
                Created At
              </Typography>
              <Typography>
                {lead.createdAt
                  ? new Date(lead.createdAt).toLocaleString()
                  : "-"}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography color="text.secondary" variant="body2">
                Last Updated
              </Typography>
              <Typography>
                {lead.updatedAt
                  ? new Date(lead.updatedAt).toLocaleString()
                  : "-"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LeadDetails;
