import { createPayment, verifyPayment } from "../services/bkashHelper.js";
import { getDB } from "../config/db.js";

const ordersCollection = "orders";

export const initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const db = getDB();

    const order = await db.collection(ordersCollection).findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Order is already paid or in invalid state" });
    }

    const paymentResponse = await createPayment(orderId, order.total);

    // Update order with payment info
    await db.collection(ordersCollection).updateOne(
      { orderId },
      {
        $set: {
          paymentInfo: paymentResponse,
          status: "awaiting_payment",
          updatedAt: new Date(),
        },
      }
    );

    res.status(200).json(paymentResponse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error initiating payment", error: error.message });
  }
};

export const handlePaymentCallback = async (req, res) => {
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

    res.status(200).json({
      message: "Payment successful",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error processing payment callback",
      error: error.message,
    });
  }
};
