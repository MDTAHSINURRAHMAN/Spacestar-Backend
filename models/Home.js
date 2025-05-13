import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const Text = {
  async create(data) {
    const db = getDB();
    const result = await db.collection("home").insertOne({
      text: data.text,
      instagram: data.instagram || "",
      facebook: data.facebook || "",
      whatsapp: data.whatsapp || "",
      twitter: data.twitter || "",
      createdAt: new Date(),
    });
    return result.ops?.[0] || { _id: result.insertedId, ...data };
  },

  async findAll() {
    const db = getDB();
    return await db.collection("home").find().sort({ createdAt: -1 }).toArray();
  },

  async findById(id) {
    const db = getDB();
    return await db.collection("home").findOne({ _id: new ObjectId(id) });
  },

  async update(id, data) {
    const db = getDB();
    const result = await db.collection("home").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          text: data.text,
          instagram: data.instagram,
          facebook: data.facebook,
          whatsapp: data.whatsapp,
          twitter: data.twitter,
          updatedAt: new Date(),
        },
      }
    );
    if (result.matchedCount > 0) {
      return await this.findById(id);
    }
    return null;
  },

  async delete(id) {
    const db = getDB();
    return await db.collection("home").deleteOne({ _id: new ObjectId(id) });
  },
};
