import express from "express";
import homeController from "../controllers/homeController.js";

const router = express.Router();

// POST: Create a new text entry
router.post("/texts", homeController.createText);

// GET: Get all text entries
router.get("/texts", homeController.getAllTexts);

// GET: Get a single text entry by ID
router.get("/texts/:id", homeController.getText);

// PUT: Update a text entry by ID
router.put("/texts/:id", homeController.updateText);

// DELETE: Delete a text entry by ID
router.delete("/texts/:id", homeController.deleteText);

export default router;
