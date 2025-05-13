import { getDB } from "../config/db.js";
import { About } from "../models/About.js";
import { uploadToS3, getSignedImageUrl } from "../services/s3Service.js";

// Get About content
export const getAbout = async (req, res) => {
  try {
    const db = getDB();
    const about = await db.collection("about").findOne({});

    if (about) {
      // Generate signed URLs for images if they exist
      if (about.image1) {
        about.image1Url = await getSignedImageUrl(about.image1);
      }
      if (about.image2) {
        about.image2Url = await getSignedImageUrl(about.image2);
      }
    }

    res.status(200).json(about || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update or create About content
export const updateAbout = async (req, res) => {
  try {
    const db = getDB();
    const { brandMessage, missionPoints, email, address, phone, iframeLink } =
      req.body;

    // Handle image uploads
    let image1Key = undefined;
    let image2Key = undefined;

    if (req.files) {
      if (req.files.image1) {
        image1Key = `about/image1-${Date.now()}${
          req.files.image1[0].originalname
        }`;
        await uploadToS3(req.files.image1[0], image1Key);
      }
      if (req.files.image2) {
        image2Key = `about/image2-${Date.now()}${
          req.files.image2[0].originalname
        }`;
        await uploadToS3(req.files.image2[0], image2Key);
      }
    }

    const updateData = {
      brandMessage,
      missionPoints,
      email,
      address,
      phone,
      iframeLink,
      updatedAt: new Date(),
    };

    // Only update image fields if new images were uploaded
    if (image1Key) updateData.image1 = image1Key;
    if (image2Key) updateData.image2 = image2Key;

    const result = await db
      .collection("about")
      .updateOne({}, { $set: updateData }, { upsert: true });

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      const updated = await db.collection("about").findOne({});
      // Generate signed URLs for images
      if (updated.image1) {
        updated.image1Url = await getSignedImageUrl(updated.image1);
      }
      if (updated.image2) {
        updated.image2Url = await getSignedImageUrl(updated.image2);
      }
      res.json(updated);
    } else {
      res.status(200).json({ message: "No changes made to About content" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create About content
export const createAbout = async (req, res) => {
  try {
    const db = getDB();
    const { brandMessage, missionPoints, email, address, phone, iframeLink } =
      req.body;

    // Handle image uploads
    let image1Key = undefined;
    let image2Key = undefined;

    if (req.files) {
      if (req.files.image1) {
        image1Key = `about/image1-${Date.now()}${
          req.files.image1[0].originalname
        }`;
        await uploadToS3(req.files.image1[0], image1Key);
      }
      if (req.files.image2) {
        image2Key = `about/image2-${Date.now()}${
          req.files.image2[0].originalname
        }`;
        await uploadToS3(req.files.image2[0], image2Key);
      }
    }

    const result = await db.collection("about").insertOne({
      brandMessage,
      missionPoints,
      email,
      address,
      phone,
      iframeLink,
      image1: image1Key,
      image2: image2Key,
      createdAt: new Date(),
    });

    const created = await db
      .collection("about")
      .findOne({ _id: result.insertedId });
    // Generate signed URLs for images
    if (created.image1) {
      created.image1Url = await getSignedImageUrl(created.image1);
    }
    if (created.image2) {
      created.image2Url = await getSignedImageUrl(created.image2);
    }
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete About content
export const deleteAbout = async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection("about").deleteOne({});

    if (result.deletedCount > 0) {
      res.json({ message: "About content deleted successfully" });
    } else {
      res.status(404).json({ message: "About content not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
