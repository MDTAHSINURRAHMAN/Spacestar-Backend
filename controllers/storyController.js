import { Story } from "../models/Story.js";
import { ObjectId } from "mongodb";

// GET /api/stories
export const getStory = async (req, res) => {
  try {
    const stories = await Story.findAll();
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stories", error: error.message });
  }
};

// POST /api/stories
export const createStory = async (req, res) => {
  try {
    const image = req.file?.location || ""; // S3 image
    const content = JSON.parse(req.body.content || "[]");

    const newStory = {
      image,
      content,
    };

    const result = await Story.create(newStory);
    res.status(201).json({ message: "Story created successfully", storyId: result.insertedId });
  } catch (error) {
    res.status(400).json({ message: "Failed to create story", error: error.message });
  }
};

// PUT /api/stories/:id
export const updateStory = async (req, res) => {
  try {
    const storyId = req.params.id;
    const image = req.file?.location; // Optional new image
    const content = JSON.parse(req.body.content || "[]");

    const updateData = {
      content,
    };

    if (image) updateData.image = image;

    const result = await Story.update(storyId, updateData);

    if (result.modifiedCount > 0) {
      const updated = await Story.findById(storyId);
      res.json({ message: "Story updated", story: updated });
    } else {
      res.status(404).json({ message: "Story not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Failed to update story", error: error.message });
  }
};

// DELETE /api/stories/:id
export const deleteStory = async (req, res) => {
  try {
    const storyId = req.params.id;

    const result = await Story.delete(storyId);
    if (result.deletedCount > 0) {
      res.json({ message: "Story deleted successfully" });
    } else {
      res.status(404).json({ message: "Story not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete story", error: error.message });
  }
};

