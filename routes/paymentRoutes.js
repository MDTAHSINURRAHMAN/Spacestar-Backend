import express from "express";
import {
  initiatePayment,
  handlePaymentCallback,
} from "../controllers/paymentController.js";

const router = express.Router();

// Initiate payment for an order
router.post("/:orderId/initiate", initiatePayment);

// Handle payment callback from bKash
router.post("/callback", handlePaymentCallback);

export default router;
