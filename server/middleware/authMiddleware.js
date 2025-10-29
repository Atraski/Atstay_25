import User from "../models/User.js";
import { getAuth, clerkClient } from "@clerk/express";

export const protect = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized, userId missing" });
    }

    let user = await User.findById(userId);
    if (!user) {
      // Create a local user record from Clerk profile on first access
      const cu = await clerkClient.users.getUser(userId);
      const primaryEmail = cu?.emailAddresses?.[0]?.emailAddress || "";
      const username =
        cu?.username ||
        [cu?.firstName, cu?.lastName].filter(Boolean).join(" ") ||
        primaryEmail?.split("@")[0] ||
        "Guest";

      user = await User.create({
        _id: userId,
        username,
        email: primaryEmail,
        image: cu?.imageUrl || "",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth middleware error:", error);
    res.status(500).json({ success: false, message: "Authentication failed" });
  }
};