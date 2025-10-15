import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// API to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;

        // FIX: Clerk middleware req.auth object add karta hai, function nahi.
        const hotel = await Hotel.findOne({ owner: req.auth.userId });

        if (!hotel) {
            return res.status(404).json({ success: false, message: "No Hotel found for this owner." });
        }
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "Please upload at least one image." });
        }

        const uploadPromises = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        });

        const images = await Promise.all(uploadPromises);

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        });

        res.status(201).json({ success: true, message: "Room created successfully" });
    } catch (error) {
        console.error("ERROR CREATING ROOM:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// API to get all rooms
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true })
            .populate({
                path: 'hotel',
                populate: {
                    path: 'owner',
                    select: 'image',
                },
            }).sort({ createdAt: -1 });
        res.json({ success: true, rooms });
    } catch (error) {
        console.error("ERROR GETTING ROOMS:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// API to get all rooms for a specific hotel owner
export const getOwnerRooms = async (req, res) => {
    try {
        // FIX: Yeh bhi req.auth.userId hona chahiye.
        const hotelData = await Hotel.findOne({ owner: req.auth.userId });

        if (!hotelData) {
            return res.json({ success: true, rooms: [] }); // Return empty array if no hotel
        }

        const rooms = await Room.find({ hotel: hotelData._id }).populate("hotel");
        res.json({ success: true, rooms });
    } catch (error) {
        console.error("ERROR GETTING OWNER ROOMS:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// API to toggle availability of a room
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);

        if (!roomData) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({ success: true, message: "Room availability updated" });
    } catch (error) {
        console.error("ERROR TOGGLING AVAILABILITY:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


// ## YEH NAYA FUNCTION ADD KIYA GAYA HAI ##
export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id).populate("hotel"); 

        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        res.json({ success: true, room });

    } catch (error) {
        console.error("Error fetching room by ID:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};