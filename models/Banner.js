import { getDB } from "../config/db.js";

const collection = "banner";

export const Banner = {
  async get() {
    const db = getDB();
    const banner = await db.collection(collection).findOne({});
    if (!banner) {
      // Create default banner if none exists
      const defaultBanner = {
        imageUrl: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.collection(collection).insertOne(defaultBanner);
      return defaultBanner;
    }
    return banner;
  },

  async update(imageUrl) {
    const db = getDB();
    return await db.collection(collection).updateOne(
      {},
      {
        $set: {
          imageUrl,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  },
};
