import { getDB } from "../config/db.js";

const collection = "reviews";

export const Review = {
  async create(reviewData) {
    const db = getDB();
    const result = await db.collection(collection).insertOne({
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  },

  async findAll() {
    const db = getDB();
    return await db.collection(collection).find().toArray();
  },

  async delete(id) {
    const db = getDB();
    return await db.collection(collection).deleteOne({ _id: id });
  },

  async update(id, updateData) {
    const db = getDB();
    const { reviewerName, rating, date, subheading, review } = updateData;
    return await db.collection(collection).updateOne(
      { _id: id },
      {
        $set: {
          reviewerName,
          rating,
          date,
          subheading,
          review,
          updatedAt: new Date(),
        },
      }
    );
  },
};
