
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Paper,
  Typography
} from "@mui/material";

import { toast } from "sonner";

import LeadForm from "../../components/LeadForm";
import { useCreateLead } from "../../hooks/useLeads";

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

function CreateLead() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);

  const createMutation = useCreateLead();

  // Update only the field that the user changes.
  const handleChange = (name, value) => {
    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  const handleSubmit = async (leadData) => {
    try {
      const response = await createMutation.mutateAsync(leadData);

      toast.success(
        response.message || "Lead created successfully"
      );

      navigate("/leads");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to create lead"
      );
    }
  };

  return (
    <Box>
      <Button
        onClick={() => navigate("/leads")}
        sx={{ mb: 2 }}
      >
        Back to Leads
      </Button>

      <Typography variant="h4" fontWeight={700} gutterBottom>
        Create New Lead
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Enter the lead information below.
      </Typography>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {createMutation.error.response?.data?.message ||
            "Unable to create lead"}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{ p: { xs: 2, md: 3 }, border: "1px solid #E2E8F0" }}
      >
        <LeadForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitLabel="Create Lead"
        />
      </Paper>
    </Box>
  );
}

export default CreateLead;
