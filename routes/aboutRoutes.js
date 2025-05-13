import express from "express";
import {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
} from "../controllers/aboutController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// GET: Fetch about page content
router.get("/", getAbout);

// POST: Create a new about page content
router.post(
  "/",
  protect,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  createAbout
);

// DELETE: Delete about page content
router.delete("/", protect, deleteAbout);

// PUT: Update about page content (single document)
router.put(
  "/",
  protect,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  updateAbout
);

export default router;
