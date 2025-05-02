import express from "express";
import { getBanner, updateBanner, updateBannerText } from "../controllers/bannerController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", getBanner);
router.put("/", protect, upload.single("image"), updateBanner);
router.put("/text", protect, updateBannerText);

export default router;
