import { Router } from "express";
import { getAbout } from "../controllers/aboutController";
import { getBanner } from "../controllers/bannerController";
import { getAllTexts } from "../controllers/textController";
import { getAllOrders } from "../controllers/orderController";
import { getOrderById } from "../controllers/orderController";
import { getAllProducts } from "../controllers/productController";
import { getProductById } from "../controllers/productController";
import { getAllReviews } from "../controllers/reviewController";
import { getReviewById } from "../controllers/reviewController";
import { getStory } from "../controllers/storyController";

const router = Router();

// Public routes — no protection
router.get("/about", getAbout);
router.get("/banner", getBanner);
router.get("/texts", getAllTexts);
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.get("/reviews", getAllReviews);
router.get("/reviews/:id", getReviewById);
router.get("/story", getStory);

export default router;
