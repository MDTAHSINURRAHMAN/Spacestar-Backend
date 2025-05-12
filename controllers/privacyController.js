import { Privacy } from "../models/Privacy.js";
import { ObjectId } from "mongodb";
import { uploadToS3 } from "../services/s3Service.js";

// GET /api/privacy
export const getPrivacy = async (req, res) => {
  try {
    const privacies = await Privacy.findAll();
    if (!privacies || privacies.length === 0) {
      return res.status(200).json(null);
    }
    res.status(200).json(privacies);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch privacies",
      error: error.message,
    });
  }
};

// POST /api/privacy
export const createPrivacy = async (req, res) => {
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
    const key = `privacy/${timestamp}-${req.file.originalname}`;
    await uploadToS3(req.file, key);

    const image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const newPrivacy = {
      image,
      content,
    };

    const result = await Privacy.create(newPrivacy);

    res.status(201).json({
      message: "Privacy created successfully",
      privacyId: result.insertedId,
      privacy: newPrivacy,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create privacy",
      error: error.message,
    });
  }
};

// PUT /api/privacy/:id
export const updatePrivacy = async (req, res) => {
  try {
    const privacyId = req.params.id;

    if (!ObjectId.isValid(privacyId)) {
      return res.status(400).json({ message: "Invalid privacy ID format" });
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
      const key = `privacy/${timestamp}-${req.file.originalname}`;
      await uploadToS3(req.file, key);

      updateData.image = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    const result = await Privacy.update(privacyId, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Privacy not found" });
    }

    const updated = await Privacy.findById(privacyId);

    res.status(200).json({
      message: "Privacy updated successfully",
      privacy: updated,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update privacy",
      error: error.message,
    });
  }
};

// DELETE /api/privacy/:id
export const deletePrivacy = async (req, res) => {
  try {
    const privacyId = req.params.id;

    if (!ObjectId.isValid(privacyId)) {
      return res.status(400).json({ message: "Invalid privacy ID format" });
    }

    const result = await Privacy.delete(privacyId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Privacy not found" });
    }

    res.status(200).json({ message: "Privacy deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete privacy",
      error: error.message,
    });
  }
};

export default {
  getPrivacy,
  createPrivacy,
  updatePrivacy,
  deletePrivacy,
};
