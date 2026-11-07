import Lead from "../models/leadModel.js";

// Create a new lead
export const createLead = async (leadData, userId) => {
  try {
    const lead = await Lead.create({
      ...leadData,
      createdBy: userId
    });

    return lead;
  } catch (error) {
    throw error;
  }
};

// Get all leads with search, filters and pagination
export const getAllLeads = async ({
  userId,
  page = 1,
  limit = 10,
  search = "",
  status = "",
  priority = "",
  source = "",
  sortBy = "createdAt",
  sortOrder = "desc"
}) => {
  try {
    // Calculate how many leads to skip
    const skip = (page - 1) * limit;

    // Every query must show only the logged-in user's leads
    const searchCondition = {
      createdBy: userId
    };

    // Search by name, email, phone or company
    if (search) {
      searchCondition.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }

    // Apply status filter
    if (status) {
      searchCondition.status = status;
    }

    // Apply priority filter
    if (priority) {
      searchCondition.priority = priority;
    }

    // Apply source filter
    if (source) {
      searchCondition.source = source;
    }

    // Allow sorting only by these fields
    const allowedSortFields = [
      "name",
      "createdAt",
      "updatedAt",
      "status",
      "priority"
    ];

    if (!allowedSortFields.includes(sortBy)) {
      sortBy = "createdAt";
    }

    // Decide ascending or descending order
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const leads = await Lead.find(searchCondition)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit);

    // Count all matching leads
    const totalLeads = await Lead.countDocuments(searchCondition);

    return {
      leads,
      currentPage: Number(page),
      totalPages: Math.ceil(totalLeads / limit),
      totalLeads
    };
  } catch (error) {
    throw error;
  }
};

// Get one lead by ID
export const getLeadById = async (leadId, userId) => {
  try {
    const lead = await Lead.findOne({
      _id: leadId,
      createdBy: userId
    });

    if (!lead) {
      throw new Error("Lead not found");
    }

    return lead;
  } catch (error) {
    throw error;
  }
};

// Update an existing lead
export const updateLead = async (leadId, userId, updateData) => {
  try {
    // Only allow these fields to be updated
    const allowedFields = [
      "name",
      "email",
      "phone",
      "company",
      "source",
      "status",
      "priority",
      "notes",
      "assignedTo"
    ];

    const updatedData = {};

    // Copy only allowed fields from the request
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        updatedData[field] = updateData[field];
      }
    });

    const lead = await Lead.findOneAndUpdate(
      {
        _id: leadId,
        createdBy: userId
      },
      updatedData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!lead) {
      throw new Error("Lead not found");
    }

    return lead;
  } catch (error) {
    throw error;
  }
};

// Delete a lead
export const deleteLead = async (leadId, userId) => {
  try {
    const lead = await Lead.findOneAndDelete({
      _id: leadId,
      createdBy: userId
    });

    if (!lead) {
      throw new Error("Lead not found");
    }

    return lead;
  } catch (error) {
    throw error;
  }
};
