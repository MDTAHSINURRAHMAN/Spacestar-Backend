import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const collection = "banner";

export const Banner = {
  async find() {
    const db = getDB();
    return await db.collection(collection).find().toArray();
  },

  async update(imageUrl) {
    const db = getDB();
    return await db.collection("banner").updateOne(
      {},
      {
        $set: {
          image: imageUrl,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
  },

  async delete(id) {
    const db = getDB();
    return await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
  },
};
