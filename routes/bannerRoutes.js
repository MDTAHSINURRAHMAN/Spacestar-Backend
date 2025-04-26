import express from "express";
import { getBanner, updateBanner } from "../controllers/bannerController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", getBanner);
router.put("/", upload.single("image"), updateBanner);

export default router;
