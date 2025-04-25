import express from "express";
import { getBanner, updateBanner } from "../controllers/bannerController.js";

const router = express.Router();

router.get("/", getBanner);
router.put("/", updateBanner);

export default router;
