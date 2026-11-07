
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";

const statuses = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Lost"
];

const priorities = ["Low", "Medium", "High"];

const sources = [
  "Website",
  "Referral",
  "Social Media",
  "Advertisement",
  "Other"
];

function LeadFilters({ filters, onFilterChange }) {

  // Update the selected filter without changing the other filters.
  const handleChange = (event) => {
    const { name, value } = event.target;

    onFilterChange({
      ...filters,
      [name]: value
    });
  };

  return (
    <Grid container spacing={2} alignItems="center">

      {/* Search input takes half of the available desktop width. */}
      <Grid size={{ xs: 12, sm: 6, md: 6 }}>
        <TextField
          fullWidth
          size="small"
          label="Search Leads"
          placeholder="Search by name, email, phone or company"
          name="search"
          value={filters.search}
          onChange={handleChange}
        />
      </Grid>

      {/* Status filter */}
      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="lead-status-label">
            Status
          </InputLabel>

          <Select
            labelId="lead-status-label"
            name="status"
            value={filters.status}
            label="Status"
            onChange={handleChange}
          >
            <MenuItem value="">
              All Statuses
            </MenuItem>

            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Priority filter */}
      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="lead-priority-label">
            Priority
          </InputLabel>

          <Select
            labelId="lead-priority-label"
            name="priority"
            value={filters.priority}
            label="Priority"
            onChange={handleChange}
          >
            <MenuItem value="">
              All Priorities
            </MenuItem>

            {priorities.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Source filter */}
      <Grid size={{ xs: 12, sm: 4, md: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="lead-source-label">
            Source
          </InputLabel>

          <Select
            labelId="lead-source-label"
            name="source"
            value={filters.source}
            label="Source"
            onChange={handleChange}
          >
            <MenuItem value="">
              All Sources
            </MenuItem>

            {sources.map((source) => (
              <MenuItem key={source} value={source}>
                {source}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

    </Grid>
  );
}

export default LeadFilters;
