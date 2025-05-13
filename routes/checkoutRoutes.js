import express from "express";
import {
  createCheckout,
  getCheckout,
  confirmPayment,
} from "../controllers/checkoutController.js";

const router = express.Router();

// Create checkout
router.post("/", createCheckout);

// Get checkout by order ID
router.get("/:orderId", getCheckout);

// Confirm payment
router.post("/confirm", confirmPayment);

export default router;
