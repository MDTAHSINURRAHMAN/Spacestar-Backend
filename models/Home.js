import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const Text = {
  async create(data) {
    const db = getDB();
    const result = await db.collection("texts").insertOne({
      text: data.text,
      createdAt: new Date(),
    });
    return result.ops?.[0] || { _id: result.insertedId, ...data };
  },

  async findAll() {
    const db = getDB();
    return await db.collection("texts").find().sort({ createdAt: -1 }).toArray();
  },

  async findById(id) {
    const db = getDB();
    return await db.collection("texts").findOne({ _id: new ObjectId(id) });
  },

  async delete(id) {
    const db = getDB();
    return await db.collection("texts").deleteOne({ _id: new ObjectId(id) });
  },
};
