import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createCashfreeOrder, verifyPayment, cashfreeWebhook } from "../controllers/paymentController.js";

const paymentRouter = express.Router();

// Create payment order (protected route)
paymentRouter.post("/create-order", protect, createCashfreeOrder);

// Verify payment status (protected route)
paymentRouter.get("/verify/:orderId", protect, verifyPayment);

// Webhook endpoint (no protection - Cashfree calls this directly)
paymentRouter.post("/webhook", cashfreeWebhook);

export default paymentRouter;


