import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import connectCloudinary from "./configs/cloudinary.js";
// import { stripeWebhooks } from "./controllers/stripeWebhooks.js";

connectDB();
connectCloudinary();

const app = express();
app.use(cors({
  origin: ['https://atstay.in', 'http://localhost:5173'],  // Replace with your frontend's domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
// API to listen to Stripe Webhooks
// app.post("/api/stripe",express.raw({ type: "application/json" }),stripeWebhooks);

// Middleware to parse JSON
app.use(express.json());
app.use(clerkMiddleware());

// Use express.raw() only for Clerk webhook route to handle raw buffer
app.use("/api/clerk", express.raw({ type: 'application/json' }), clerkWebhooks);

app.get("/", (req, res) => res.send("API is working"));
app.get("/api/test", (req, res) => res.json({ success: true, message: "Test route working" }));
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
