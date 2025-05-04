import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  updateOrder,
} from "../controllers/orderController.js";
import { validateOrder } from "../middlewares/validateOrder.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", validateOrder, createOrder);
router.get("/", protect, getAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, updateOrderStatus);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);

export default router;
