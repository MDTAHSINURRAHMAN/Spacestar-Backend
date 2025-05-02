import { Review } from "../models/Review.js";
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";
export const createReview = async (req, res) => {
  try {
    const result = await Review.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating review", error: error.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid review ID" });
    }

    const reviewId = new ObjectId(id);
    const db = getDB();
    const review = await db.collection("reviews").findOne({ _id: reviewId });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching review", error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = new ObjectId(req.params.id);
    const result = await Review.delete(reviewId);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const reviewId = new ObjectId(req.params.id);
    const updateData = req.body;
    const result = await Review.update(reviewId, updateData);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating review", error: error.message });
  }
};
