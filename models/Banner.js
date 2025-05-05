import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const collection = "banner";

export const Banner = {
  async find() {
    const db = getDB();
    return await db.collection(collection).find().toArray();
  },

  async create(data) {
    const db = getDB();
    const result = await db.collection(collection).insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
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
