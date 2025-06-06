import { Story } from "../models/Story.js";
import { ObjectId } from "mongodb";
import { uploadToS3 } from "../services/s3Service.js";
import { getDB } from "../config/db.js";

// GET /api/story
export const getStory = async (req, res) => {
  try {
    const db = getDB(); // get the db instance

    const stories = await db.collection("story").find().toArray();

    res.status(200).json(stories); // ✅ always return array
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stories",
      error: error.message,
    });
  }
};


// POST /api/story
export const createStory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const content = JSON.parse(req.body.content || "{}");

    if (
      !content ||
      typeof content !== "object" ||
      Object.keys(content).length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Valid Tiptap content is required" });
    }

    // Upload to S3
    const timestamp = Date.now();
    const key = `stories/${timestamp}-${req.file.originalname}`;
    await uploadToS3(req.file, key);

    const image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const newStory = {
      image,
      content,
    };

    const result = await Story.create(newStory);

    res.status(201).json({
      message: "Story created successfully",
      storyId: result.insertedId,
      story: newStory,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create story",
      error: error.message,
    });
  }
};

// PUT /api/story/:id
export const updateStory = async (req, res) => {
  try {
    const storyId = req.params.id;

    if (!ObjectId.isValid(storyId)) {
      return res.status(400).json({ message: "Invalid story ID format" });
    }

    const content = JSON.parse(req.body.content || "{}");

    if (
      !content ||
      typeof content !== "object" ||
      Object.keys(content).length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Valid Tiptap content is required" });
    }

    const updateData = { content };

    if (req.file) {
      const timestamp = Date.now();
      const key = `stories/${timestamp}-${req.file.originalname}`;
      await uploadToS3(req.file, key);

      updateData.image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    const result = await Story.update(storyId, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Story not found" });
    }

    const updated = await Story.findById(storyId);

    res.status(200).json({
      message: "Story updated successfully",
      story: updated,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update story",
      error: error.message,
    });
  }
};

// DELETE /api/story/:id
export const deleteStory = async (req, res) => {
  try {
    const storyId = req.params.id;

    if (!ObjectId.isValid(storyId)) {
      return res.status(400).json({ message: "Invalid story ID format" });
    }

    const result = await Story.delete(storyId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Story not found" });
    }

    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete story",
      error: error.message,
    });
  }
};

export default {
  getStory,
  createStory,
  updateStory,
  deleteStory,
};
