
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead
} from "../services/leadService.js";

// Create a new lead
export const addLead = async (req, res) => {
  try {
    const lead = await createLead(req.body, req.user._id);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


// Get all leads
export const getLeads = async (req, res) => {
  try {
    const {
      page,
      limit,
      search,
      status,
      priority,
      source,
      sortBy,
      sortOrder
    } = req.validatedQuery;

    const result = await getAllLeads({
      userId: req.user._id,
      page,
      limit,
      search,
      status,
      priority,
      source,
      sortBy,
      sortOrder
    });

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get one lead by ID
export const getLead = async (req, res) => {
  try {
    const lead = await getLeadById(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      lead
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Update a lead
export const editLead = async (req, res) => {
  try {
    const lead = await updateLead(
      req.params.id,
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a lead
export const removeLead = async (req, res) => {
  try {
    await deleteLead(
      req.params.id,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully"
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
