
import express from "express";

import {
  getDashboard,
  getDashboardUsersList,
  getDashboardLeadsList,
  getSelectedUserLeads
} from "../controllers/dashboardController.js";

import {
  protect,
  adminOnly
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Every dashboard route requires authentication.
router.use(protect);

// Dashboard summary: admin or normal user.
router.get("/", getDashboard);

// The following routes are admin-only.
router.get("/users", adminOnly, getDashboardUsersList);

router.get("/leads", adminOnly, getDashboardLeadsList);

router.get("/users/:userId/leads", adminOnly, getSelectedUserLeads);

export default router;
