
import axiosInstance from "./axiosInstance";

// Get leads with pagination, search, filters and sorting.
export const getLeads = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/leads", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get one lead by its MongoDB ID.
export const getLeadById = async (id) => {
  try {
    const response = await axiosInstance.get(`/leads/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new lead.
export const createLead = async (leadData) => {
  try {
    const response = await axiosInstance.post("/leads", leadData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an existing lead.
export const updateLead = async ({ id, leadData }) => {
  try {
    const response = await axiosInstance.put(`/leads/${id}`, leadData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a lead.
export const deleteLead = async (id) => {
  try {
    const response = await axiosInstance.delete(`/leads/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
