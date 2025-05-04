import express from "express";
import { getAbout, createAbout, updateAbout, deleteAbout } from "../controllers/aboutController.js";

const router = express.Router();

// GET: Fetch about page content
router.get("/", getAbout);

// POST: Create a new about page content
router.post("/", createAbout);

// DELETE: Delete about page content
router.delete("/", deleteAbout);

// PUT: Update about page content (single document)
router.put("/", updateAbout);

export default router;
