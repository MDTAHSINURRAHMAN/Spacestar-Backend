import express from "express";
import { createText, getAllTexts, getText, updateText, deleteText } from "../controllers/homeController.js";

const router = express.Router();

// POST: Create a new text entry
router.post("/texts", createText);

// GET: Get all text entries
router.get("/texts", getAllTexts);

// GET: Get a single text entry by ID
router.get("/texts/:id", getText);

// PUT: Update a text entry by ID
router.put("/texts/:id", updateText);

// DELETE: Delete a text entry by ID
router.delete("/texts/:id", deleteText);

export default router;
