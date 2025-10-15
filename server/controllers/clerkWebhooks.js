import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks  = async (req, res) => {
  try {
    // Create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Getting Headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // IMPORTANT: verify the RAW body buffer (req.body is a Buffer because of express.raw)
    await whook.verify(req.body, headers);

    // Parse payload from raw buffer
    const payload = JSON.parse(req.body.toString());
    console.log("Received Webhook payload:", JSON.stringify(payload, null, 2));

    const { data, type } = payload;

    // Use safe accessors and defaults in case some fields are missing
    

    //Switch case for different webhook types

    switch (type) {
      case "user.created": {

        const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address ?? "",
      username: ((data.first_name ?? "") + " " + (data.last_name ?? "")).trim() || "No Name",
      image: data.image_url ?? "",
      recentSearchedCities: [],
    };

        await User.create(userData);
        break;
      }
      case "user.updated": {
        const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address ?? "",
      username: ((data.first_name ?? "") + " " + (data.last_name ?? "")).trim() || "No Name",
      image: data.image_url ?? "",
      recentSearchedCities: [],
    };
    
        // upsert so if not found, we still create/update safely
        await User.findByIdAndUpdate(data.id, userData, { new: true, upsert: true });
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }
      default:
        break;
    }

    res.json({ success: true, message: "Webhook received" });
  } catch (error) {
    // log full error for debugging
    console.error("Webhook handler error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
