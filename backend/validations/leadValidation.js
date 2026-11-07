
import Joi from "joi";

// Allowed lead sources
const leadSources = [
  "Website",
  "Referral",
  "Social Media",
  "Advertisement",
  "Other"
];

// Allowed lead statuses
const leadStatuses = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Lost"
];

// Allowed lead priorities
const leadPriorities = [
  "Low",
  "Medium",
  "High"
];

// Validate MongoDB ObjectId
const objectIdValidation = Joi.string()
  .hex()
  .length(24);

// Create lead validation
export const createLeadSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .allow("", null)
    .optional(),

  phone: Joi.string()
    .trim()
    .min(7)
    .max(20)
    .required(),

  company: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .optional(),

  source: Joi.string()
    .valid(...leadSources)
    .default("Other"),

  status: Joi.string()
    .valid(...leadStatuses)
    .default("New"),

  priority: Joi.string()
    .valid(...leadPriorities)
    .default("Medium"),

  notes: Joi.string()
    .max(2000)
    .allow("")
    .optional(),

  assignedTo: objectIdValidation
    .allow(null)
    .optional()
});

// Update lead validation
export const updateLeadSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100),

  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .allow("", null),

  phone: Joi.string()
    .trim()
    .min(7)
    .max(20),

  company: Joi.string()
    .trim()
    .max(100)
    .allow(""),

  source: Joi.string()
    .valid(...leadSources),

  status: Joi.string()
    .valid(...leadStatuses),

  priority: Joi.string()
    .valid(...leadPriorities),

  notes: Joi.string()
    .max(2000)
    .allow(""),

  assignedTo: objectIdValidation
    .allow(null)
})
  .min(1);

// Get leads validation
export const getLeadsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),

  search: Joi.string()
    .trim()
    .max(100)
    .allow("")
    .default(""),

  status: Joi.string()
    .valid(...leadStatuses)
    .allow("")
    .default(""),

  priority: Joi.string()
    .valid(...leadPriorities)
    .allow("")
    .default(""),

  source: Joi.string()
    .valid(...leadSources)
    .allow("")
    .default(""),

  sortBy: Joi.string()
    .valid("name", "createdAt", "updatedAt", "status", "priority")
    .default("createdAt"),

  sortOrder: Joi.string()
    .valid("asc", "desc")
    .default("desc")
});

// Validate lead ID in URL
export const leadIdSchema = Joi.object({
  id: objectIdValidation.required()
});
