import express from "express";
import { createText, getAllTexts, updateText, deleteText } from "../controllers/homeController.js";

const router = express.Router();

// POST: Create a new text entry
router.post("/", createText);

// GET: Get all text entries
router.get("/", getAllTexts);


// PUT: Update a text entry by ID
router.put("/:id", updateText);

// DELETE: Delete a text entry by ID
router.delete("/:id", deleteText);

export default router;
