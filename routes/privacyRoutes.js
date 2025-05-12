import express from "express";
import {
  getPrivacy,
  createPrivacy,
  updatePrivacy,
  deletePrivacy,
} from "../controllers/privacyController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getPrivacy);

// Protected Routes (admin only)
router.post("/", protect, upload.single("image"), createPrivacy);
router.put("/:id", protect, upload.single("image"), updatePrivacy);
router.delete("/:id", protect, deletePrivacy);

export default router;