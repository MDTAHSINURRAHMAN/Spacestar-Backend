import express from "express";
import { loginAdmin, getMe } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", loginAdmin);

export default router;
