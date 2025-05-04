import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";

const collection = "reviews";

export const Review = {
  async create(reviewData) {
    const db = getDB();
    const result = await db.collection(collection).insertOne({
      productId: new ObjectId(reviewData.productId),
      image: reviewData.image,
      name: reviewData.name,
      rating: reviewData.rating,
      subtext: reviewData.subtext,
      review: reviewData.review,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  },

  async findAll() {
    const db = getDB();
    return await db.collection(collection).find().toArray();
  },

  async findByProductId(productId) {
    const db = getDB();
    return await db
      .collection(collection)
      .find({ productId: new ObjectId(productId) })
      .toArray();
  },

  async delete(id) {
    const db = getDB();
    return await db.collection(collection).deleteOne({ _id: id });
  },

  async update(id, updateData) {
    const db = getDB();
    const { productId, image, name, rating, subtext, review } = updateData;
    return await db.collection(collection).updateOne(
      { _id: id },
      {
        $set: {
          ...(productId && { productId: new ObjectId(productId) }),
          image,
          name,
          rating,
          subtext,
          review,
          updatedAt: new Date(),
        },
      }
    );
  },
};
