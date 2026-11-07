import express from "express";

import {
  getUsers,
  getUser,
  editUser,
  changeUserStatus
} from "../controllers/userController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

// Get all users
router.get("/", getUsers);

// Get one user
router.get("/:id", getUser);

// Update user details
router.put("/:id", editUser);

// Activate or deactivate a user
router.patch("/:id/status", changeUserStatus);

export default router;