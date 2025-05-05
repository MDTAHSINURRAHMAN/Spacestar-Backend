import { Banner } from "../models/Banner.js";
import { ObjectId } from "mongodb";
import { uploadToS3 } from "../services/s3Service.js";

// GET: Retrieve all banners
export const getBanner = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json(banners);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch banners", error: error.message });
  }
};

// POST: Create a new banner with image upload to S3
export const createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const timestamp = Date.now();
    const key = `banners/${timestamp}-${req.file.originalname}`;

    await uploadToS3(req.file, key);

    const result = await Banner.create({ image: key });

    res.status(201).json({
      message: "Banner created successfully",
      bannerId: result.insertedId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create banner", error: error.message });
  }
};

// PUT: Update banner image by ID
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid banner ID" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const timestamp = Date.now();
    const key = `banners/${timestamp}-${req.file.originalname}`;

    await uploadToS3(req.file, key);

    const imageUrl = await getSignedImageUrl(key);
    await Banner.update(imageUrl);

    res.status(200).json({ imageUrl });

    res.status(200).json({ message: "Banner updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update banner", error: error.message });
  }
};

// DELETE: Delete banner by ID
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid banner ID" });
    }

    const result = await Banner.delete(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json({ message: "Banner deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete banner", error: error.message });
  }
};

export default {
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
};
