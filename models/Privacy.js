import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const collection = "privacy";

export const Privacy = {
  async create(privacyData) {
    const db = getDB();
    const result = await db.collection(collection).insertOne({
      ...privacyData,
      image: privacyData.image || "", // S3 image URL
      content: privacyData.content || {}, // Tiptap JSON content
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  },

  async findAll() {
    const db = getDB();
    return await db
      .collection(collection)
      .find()
      .sort({ createdAt: -1 })
      .toArray();
  },

  async findById(id) {
    const db = getDB();
    return await db.collection(collection).findOne({ _id: new ObjectId(id) });
  },

  async update(id, updateData) {
    const db = getDB();
    return await db.collection(collection).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );
  },

  async delete(id) {
    const db = getDB();
    return await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
  },
};

export default Privacy;
