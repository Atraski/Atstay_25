import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// API to create a new hotel
// POST /api/hotels
export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id;

    // Input validation
    if (!name || !address || !contact || !city) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields (name, address, contact, city) are required" 
      });
    }

    // Basic validation
    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: "Hotel name must be at least 2 characters" 
      });
    }

    if (typeof address !== 'string' || address.trim().length < 5) {
      return res.status(400).json({ 
        success: false, 
        message: "Address must be at least 5 characters" 
      });
    }

    // Check if User Already Registered
    const existingHotel = await Hotel.findOne({ owner });
    if (existingHotel) {
      return res.status(400).json({ 
        success: false, 
        message: "Hotel already registered for this user" 
      });
    }

    await Hotel.create({ 
      name: name.trim(), 
      address: address.trim(), 
      contact: contact.trim(), 
      city: city.trim(), 
      owner 
    });

    // Update User Role
    await User.findByIdAndUpdate(owner, { role: "hotelOwner" });

    res.status(201).json({ 
      success: true, 
      message: "Hotel registered successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to register hotel" 
    });
  }
};