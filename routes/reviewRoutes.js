import express from "express";
import {
  createReview,
  getAllReviews,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);

router.get("/", getAllReviews);
router.delete("/:id", deleteReview);

export default router;
