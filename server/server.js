import express from "express"
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js"; 
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from "./controllers/clerkWebhooks.js";


connectDB();

const app = express();

app.use(cors());    

// middleware for normal routes
app.use(express.json());

// Webhook route MUST receive raw body for svix verification.
// Put this route BEFORE clerkMiddleware so webhook requests are NOT processed by clerkMiddleware.
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }), // <-- important: raw buffer
  clerkWebhooks
);

// Now apply Clerk middleware for other (authenticated) routes
app.use(clerkMiddleware());


app.get("/home", (req, res) =>res.send("API is running..."));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


