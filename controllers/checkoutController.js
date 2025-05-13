import { getDB } from "../config/db.js";
import { ObjectId } from "mongodb";
import { createPayment, verifyPayment } from "../services/bkashHelper.js";
import { v4 as uuidv4 } from "uuid";

const ordersCollection = "orders";
const cartsCollection = "carts";

// POST /api/checkout
export const createCheckout = async (req, res) => {
  try {
    const { cartId, customerInfo, shippingAddress, paymentMethod } = req.body;

    const db = getDB();

    // Get cart data
    const cart = await db.collection(cartsCollection).findOne({ cartId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Calculate order totals (assuming cart items have price and quantity)
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = 60; // Fixed shipping cost
    const total = subtotal + shippingCost;

    // Create order
    const order = {
      orderId: uuidv4(),
      cartId,
      customerInfo,
      shippingAddress,
      items: cart.items,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection(ordersCollection).insertOne(order);

    // If payment method is bKash, initiate payment
    if (paymentMethod === "bkash") {
      const paymentResponse = await createPayment(order.orderId, order.total);

      // Update order with payment info
      await db
        .collection(ordersCollection)
        .updateOne(
          { orderId: order.orderId },
          { $set: { paymentInfo: paymentResponse, status: "awaiting_payment" } }
        );

      return res.json({
        order,
        paymentInfo: paymentResponse,
      });
    }

    // For cash on delivery
    res.json({ order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating checkout", error: error.message });
  }
};

// GET /api/checkout/:orderId
export const getCheckout = async (req, res) => {
  try {
    const { orderId } = req.params;
    const db = getDB();

    const order = await db.collection(ordersCollection).findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

// POST /api/checkout/confirm
export const confirmPayment = async (req, res) => {
  try {
    const { paymentID, status } = req.body;

    if (status !== "success") {
      return res.status(400).json({ message: "Payment failed" });
    }

    const paymentDetails = await verifyPayment(paymentID);

    if (paymentDetails.statusCode !== "0000") {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const orderId = paymentDetails.merchantInvoiceNumber;
    const db = getDB();

    // Update order status
    await db.collection(ordersCollection).updateOne(
      { orderId },
      {
        $set: {
          status: "paid",
          paymentInfo: {
            ...paymentDetails,
            verifiedAt: new Date(),
          },
          updatedAt: new Date(),
        },
      }
    );

    const updatedOrder = await db
      .collection(ordersCollection)
      .findOne({ orderId });

    res.json({
      message: "Payment confirmed successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error confirming payment", error: error.message });
  }
};
