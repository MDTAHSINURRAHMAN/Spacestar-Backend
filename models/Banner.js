import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const collection = "banner";

export const Banner = {
  async find() {
    const db = getDB();
    const banner = await db.collection(collection).findOne({});
    return banner;
  },

  async update(id, data) {
    const db = getDB();
    return await db.collection(collection).updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  },

  async insert(data) {
    const db = getDB();
    return await db.collection(collection).insertOne(data);
  },

  async delete(id) {
    const db = getDB();
    return await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
  }
};
