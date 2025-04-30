import { getDB } from "../config/db.js";

const collection = "orders";

export const Order = {
  async create(orderData) {
    const db = getDB();
    const result = await db.collection(collection).insertOne({
      ...orderData,
      status: "unpaid",
      subtotal: orderData.items.reduce(
        (sum, item) => sum + item.cumulativeSum,
        0
      ),
      transactionId: null,
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

  async updateStatus(id, status, transactionId = null) {
    const db = getDB();
    const updateData = {
      status,
      updatedAt: new Date(),
    };

    if (transactionId) {
      updateData.transactionId = transactionId;
    }

    return await db
      .collection(collection)
      .updateOne({ _id: id }, { $set: updateData });
  },
};
