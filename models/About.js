import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const About = {
  async get() {
    const db = getDB();
    return await db.collection("about").findOne({});
  },

  async create(data) {
    const db = getDB();
    const result = await db.collection("about").insertOne({
      ...data,
      image1: data.image1 || null,
      image2: data.image2 || null,
      iframeLink: data.iframeLink || null,
      createdAt: new Date(),
    });
    return result.ops?.[0] || { _id: result.insertedId, ...data };
  },

  async update(data) {
    const db = getDB();
    const result = await db.collection("about").updateOne(
      {},
      {
        $set: {
          brandMessage: data.brandMessage,
          missionPoints: data.missionPoints,
          email: data.email,
          address: data.address,
          phone: data.phone,
          image1: data.image1,
          image2: data.image2,
          iframeLink: data.iframeLink,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    return result;
  },

  async delete() {
    const db = getDB();
    return await db.collection("about").deleteOne({});
  },
};
