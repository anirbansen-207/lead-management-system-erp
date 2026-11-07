
import express from "express";

import {
  addLead,
  getLeads,
  getLead,
  editLead,
  removeLead
} from "../controllers/leadController.js";

import { protect } from "../middlewares/authMiddleware.js";
import validateRequest from "../middlewares/validateMiddleware.js";

import { leadLimiter } from "../middlewares/rateLimitMiddleware.js";

import {
  createLeadSchema,
  updateLeadSchema,
  getLeadsSchema,
  leadIdSchema
} from "../validations/leadValidation.js";

const router = express.Router();

// Apply rate limiting and authentication to all lead routes
router.use(leadLimiter, protect);

// Create lead
router.post(
  "/",
  validateRequest(createLeadSchema),
  addLead
);

// Get all leads
router.get(
  "/",
  validateRequest(getLeadsSchema, "query"),
  getLeads
);

// Get one lead
router.get(
  "/:id",
  validateRequest(leadIdSchema, "params"),
  getLead
);

// Update lead
router.put(
  "/:id",
  validateRequest(leadIdSchema, "params"),
  validateRequest(updateLeadSchema),
  editLead
);

// Delete lead
router.delete(
  "/:id",
  validateRequest(leadIdSchema, "params"),
  removeLead
);

export default router;
