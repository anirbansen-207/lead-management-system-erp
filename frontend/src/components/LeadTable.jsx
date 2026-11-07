
import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from "@mui/material";

function LeadTable({
  leads,
  totalLeads,
  page,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  isDeleting
}) {
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Company</strong></TableCell>
              <TableCell><strong>Phone</strong></TableCell>
              <TableCell><strong>Source</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Priority</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" py={3}>
                    No leads found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead._id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {lead.name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {lead.email || "No email"}
                    </Typography>
                  </TableCell>

                  <TableCell>{lead.company || "-"}</TableCell>
                  <TableCell>{lead.phone}</TableCell>
                  <TableCell>{lead.source}</TableCell>

                  <TableCell>
                    <Chip label={lead.status} size="small" />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={lead.priority}
                      size="small"
                      color={
                        lead.priority === "High"
                          ? "error"
                          : lead.priority === "Medium"
                            ? "warning"
                            : "success"
                      }
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        flexWrap: "wrap",
                        gap: 0.5
                      }}
                    >
                      <Button size="small" onClick={() => onView(lead._id)}>
                        View
                      </Button>

                      <Button size="small" onClick={() => onEdit(lead._id)}>
                        Edit
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        disabled={isDeleting}
                        onClick={() => onDelete(lead._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalLeads}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={10}
        rowsPerPageOptions={[10]}
      />
    </>
  );
}

export default LeadTable;
