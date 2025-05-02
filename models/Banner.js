import { getDB } from "../config/db.js";
import { uploadToS3, getSignedImageUrl } from "../services/s3Service.js";

const collection = "banner";

export const Banner = {
  async get() {
    const db = getDB();
    const banner = await db.collection(collection).findOne({});
    if (!banner) {
      // Create default banner if none exists
      const defaultBanner = {
        imageKey: "",
        text: "Pre-orders enjoy 10% off Full price item",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.collection(collection).insertOne(defaultBanner);
      return defaultBanner;
    }

    // Get signed URL for the image
    if (banner.imageKey) {
      banner.imageUrl = await getSignedImageUrl(banner.imageKey);
    }

    return banner;
  },

  async update(imageFile, text) {
    const db = getDB();
    let imageKey;
    if (imageFile) {
      const fileName = `banner/${Date.now()}-${imageFile.originalname}`;
      // Upload to S3
      imageKey = await uploadToS3(imageFile, fileName);
    }
    // Update database
    const updateFields = {
      updatedAt: new Date(),
    };
    if (imageKey) updateFields.imageKey = imageKey;
    if (typeof text === "string") updateFields.text = text;
    return await db.collection(collection).updateOne(
      {},
      {
        $set: updateFields,
      },
      { upsert: true }
    );
  },
};

export const BannerText = {
  async update(text) {
    const db = getDB();
    return await db.collection(collection).updateOne({}, { $set: { text } });
  },
};

