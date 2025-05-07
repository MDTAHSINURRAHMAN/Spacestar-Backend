import { Order } from "../models/Order.js";
import { ObjectId } from "mongodb";
// create order
export const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({
      message: "Order created successfully",
      orderId: order.insertedId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const search = req.query.search?.toLowerCase() || "";
    const db = getDB();

    const filter =
      search && search.trim() !== ""
        ? {
            $or: [
              { "customer.name": { $regex: search, $options: "i" } },
              { "customer.email": { $regex: search, $options: "i" } },
              { "customer.phone": { $regex: search, $options: "i" } },
              { "customer.address": { $regex: search, $options: "i" } },
              { status: { $regex: search, $options: "i" } },
            ],
          }
        : {};

    const orders = await db.collection("orders").find(filter).toArray();

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = new ObjectId(req.params.id);
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    const orderId = new ObjectId(req.params.id);
    const result = await Order.updateStatus(orderId, status);
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating order status", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const orderId = new ObjectId(req.params.id);
    const result = await Order.delete(orderId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting order", error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const orderId = new ObjectId(req.params.id);
    const updateData = { ...req.body };

    // Prevent update of immutable _id field
    delete updateData._id;

    const result = await Order.update(orderId, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order", error: error.message });
  }
};
