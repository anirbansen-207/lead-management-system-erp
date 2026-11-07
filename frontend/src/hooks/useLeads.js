
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";

import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead
} from "../api/leadApi";

// Fetch the lead list using the supplied filters and pagination.
export const useLeads = (params) => {
  return useQuery({
    queryKey: ["leads", params],
    queryFn: () => getLeads(params)
  });
};

// Fetch one lead using its ID.
export const useLead = (id) => {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => getLeadById(id),
    enabled: Boolean(id)
  });
};

// Create a lead and refresh the lead list after success.
export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    }
  });
};

// Update a lead and refresh both the list and its detail query.
export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLead,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });

      if (response.lead?._id) {
        queryClient.invalidateQueries({
          queryKey: ["lead", response.lead._id]
        });
      }
    }
  });
};

// Delete a lead and refresh the lead list.
export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    }
  });
};
