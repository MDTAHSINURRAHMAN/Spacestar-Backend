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

  async update(imageFile) {
    const db = getDB();
    const fileName = `banner/${Date.now()}-${imageFile.originalname}`;

    // Upload to S3
    const imageKey = await uploadToS3(imageFile, fileName);

    // Update database
    return await db.collection(collection).updateOne(
      {},
      {
        $set: {
          imageKey,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  },
};
