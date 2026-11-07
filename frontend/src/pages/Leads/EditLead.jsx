
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography
} from "@mui/material";

import { toast } from "sonner";

import LeadForm from "../../components/LeadForm";

import {
  useLead,
  useUpdateLead
} from "../../hooks/useLeads";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "Other",
  status: "New",
  priority: "Medium",
  notes: ""
};

function EditLead() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);

  const {
    data,
    isLoading,
    isError,
    error
  } = useLead(id);

  const updateMutation = useUpdateLead();

  // Fill the form after the backend returns the existing lead.
  useEffect(() => {
    if (data?.lead) {
      setFormData({
        name: data.lead.name || "",
        email: data.lead.email || "",
        phone: data.lead.phone || "",
        company: data.lead.company || "",
        source: data.lead.source || "Other",
        status: data.lead.status || "New",
        priority: data.lead.priority || "Medium",
        notes: data.lead.notes || ""
      });
    }
  }, [data]);

  const handleChange = (name, value) => {
    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (leadData) => {
    try {
      const response = await updateMutation.mutateAsync({
        id,
        leadData
      });

      toast.success(
        response.message || "Lead updated successfully"
      );

      navigate("/leads");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update lead"
      );
    }
  };

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

  return (
    <Box>
      <Button onClick={() => navigate("/leads")} sx={{ mb: 2 }}>
        Back to Leads
      </Button>

      <Typography variant="h4" fontWeight={700} gutterBottom>
        Edit Lead
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: { xs: 2, md: 3 }, border: "1px solid #E2E8F0" }}
      >
        <LeadForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitLabel="Update Lead"
        />
      </Paper>
    </Box>
  );
}

export default EditLead;
