import express from "express";
import { getBanner, createBanner, updateBanner, updateBannerText, deleteBanner } from "../controllers/bannerController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET: Get all banners
router.get("/", getBanner);


// POST: Create a new banner
router.post("/", protect, upload.single("image"), createBanner);

// PUT: Update a banner by ID
router.put("/:id", protect, upload.single("image"), updateBanner);

// DELETE: Delete a banner by ID
router.delete("/:id", protect, deleteBanner);

export default router;
