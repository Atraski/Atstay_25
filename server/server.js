// The Corrected server.js (The Solution)

import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express';
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();

const app = express();
app.use(cors());

// Webhook route MUST be before express.json()
app.use('api/clerk', clerkWebhooks);

// Now, use the JSON middleware for all OTHER routes
app.use(express.json());

// Now apply Clerk middleware for other (authenticated) routes
app.use(clerkMiddleware());

app.get("/home", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));