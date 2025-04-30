import express from "express";
import {
  createReview,
  getAllReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);

router.get("/", getAllReviews);
router.delete("/:id", protect, deleteReview);

export default router;
