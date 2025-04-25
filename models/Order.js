import { getDB } from "../config/db.js";

const collection = "orders";

export const Order = {
  async create(orderData) {
    const db = getDB();
    const result = await db.collection(collection).insertOne({
      ...orderData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  },

  async findById(id) {
    const db = getDB();
    return await db.collection(collection).findOne({ _id: id });
  },

  async findAll() {
    const db = getDB();
    return await db.collection(collection).find().toArray();
  },

  async updateStatus(id, status) {
    const db = getDB();
    return await db.collection(collection).updateOne(
      { _id: id },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );
  },
};
