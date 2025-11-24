import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { v2 as cloudinary } from "cloudinary";

// API to create a new room for a hotel
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;

        // Input validation
        if (!roomType || !pricePerNight || !amenities) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields (roomType, pricePerNight, amenities) are required" 
            });
        }

        // Validate price
        const price = Number(pricePerNight);
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Price per night must be a positive number" 
            });
        }

        // Validate amenities
        let amenitiesArray;
        try {
            amenitiesArray = JSON.parse(amenities);
            if (!Array.isArray(amenitiesArray)) {
                throw new Error("Amenities must be an array");
            }
        } catch (parseError) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid amenities format" 
            });
        }

        const hotel = await Hotel.findOne({ owner: req.auth.userId });

        if (!hotel) {
            return res.status(404).json({ 
                success: false, 
                message: "No hotel found for this owner" 
            });
        }
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Please upload at least one image" 
            });
        }

        // Upload images to Cloudinary
        const uploadPromises = req.files.map(async (file) => {
            try {
                const response = await cloudinary.uploader.upload(file.path, {
                    folder: 'atstay/rooms',
                    resource_type: 'image',
                });
                return response.secure_url;
            } catch (uploadError) {
                throw new Error(`Failed to upload image: ${uploadError.message}`);
            }
        });

        const images = await Promise.all(uploadPromises);

        await Room.create({
            hotel: hotel._id,
            roomType: roomType.trim(),
            pricePerNight: price,
            amenities: amenitiesArray,
            images,
        });

        res.status(201).json({ 
            success: true, 
            message: "Room created successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to create room" 
        });
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
            })
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance
        
        res.status(200).json({ 
            success: true, 
            rooms: rooms || [] 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch rooms" 
        });
    }
};

// API to get all rooms for a specific hotel owner
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.auth.userId });

        if (!hotelData) {
            return res.status(200).json({ 
                success: true, 
                rooms: [] 
            });
        }

        const rooms = await Room.find({ hotel: hotelData._id })
            .populate("hotel")
            .sort({ createdAt: -1 })
            .lean();
        
        res.status(200).json({ 
            success: true, 
            rooms: rooms || [] 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch rooms" 
        });
    }
};

// API to toggle availability of a room
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;

        if (!roomId) {
            return res.status(400).json({ 
                success: false, 
                message: "Room ID is required" 
            });
        }

        const roomData = await Room.findById(roomId).populate('hotel');

        if (!roomData) {
            return res.status(404).json({ 
                success: false, 
                message: "Room not found" 
            });
        }

        // Authorization check: Verify user owns the hotel
        const hotel = await Hotel.findById(roomData.hotel._id || roomData.hotel);
        if (!hotel || hotel.owner !== req.auth.userId) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized: You don't own this hotel" 
            });
        }

        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        
        res.status(200).json({ 
            success: true, 
            message: "Room availability updated",
            isAvailable: roomData.isAvailable
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to update room availability" 
        });
    }
};


// Get room by ID
export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 
                success: false, 
                message: "Room ID is required" 
            });
        }

        const room = await Room.findById(id)
            .populate({
                path: 'hotel',
                populate: {
                    path: 'owner',
                    select: 'username image',
                },
            })
            .lean();

        if (!room) {
            return res.status(404).json({ 
                success: false, 
                message: "Room not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            room 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch room" 
        });
    }
};