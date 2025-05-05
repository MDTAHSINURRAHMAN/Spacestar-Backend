import express from "express";
import { getBanner, updateBanner, deleteBanner } from "../controllers/bannerController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET: Get all banners
router.get("/", protect, getBanner);


// PUT: Update a banner by ID
router.put("/", protect, upload.single("image"), updateBanner);

// DELETE: Delete a banner by ID
router.delete("/", protect, deleteBanner);

export default router;
