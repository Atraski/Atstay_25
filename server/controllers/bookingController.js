import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

// Function to Check Availability of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    // Normalize dates to start of day to avoid timezone issues
    const checkIn = new Date(checkInDate);
    checkIn.setHours(0, 0, 0, 0);
    
    const checkOut = new Date(checkOutDate);
    checkOut.setHours(0, 0, 0, 0);

    const bookings = await Booking.find({
      room,
      status: { $ne: 'cancelled' }, // Don't count cancelled bookings
      $or: [
        {
          checkInDate: { $lte: checkOut },
          checkOutDate: { $gte: checkIn },
        }
      ],
    });

    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    // Return false on error to be safe
    return false;
  }
};

// API to check availability of room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;

    // Validation
    if (!room || !checkInDate || !checkOutDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Room, checkInDate, and checkOutDate are required" 
      });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid date format" 
      });
    }

    if (checkIn < today) {
      return res.status(400).json({ 
        success: false, 
        message: "Check-in date cannot be in the past" 
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ 
        success: false, 
        message: "Check-out date must be after check-in date" 
      });
    }

    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    
    res.status(200).json({ 
      success: true, 
      isAvailable 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to check availability" 
    });
  }
};

// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests, paymentMethod } = req.body;

    // Validate required fields
    if (!room || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: room, checkInDate, checkOutDate, guests" 
      });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid date format" 
      });
    }

    if (checkIn < today) {
      return res.status(400).json({ 
        success: false, 
        message: "Check-in date cannot be in the past" 
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ 
        success: false, 
        message: "Check-out date must be after check-in date" 
      });
    }

    // Validate guests
    const guestsNum = Number(guests);
    if (isNaN(guestsNum) || guestsNum < 1 || guestsNum > 10) {
      return res.status(400).json({ 
        success: false, 
        message: "Guests must be between 1 and 10" 
      });
    }

    // User must be authenticated (protected route)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const user = req.user._id;
    const userEmail = req.user.email;
    const userName = req.user.username;

    // Before Booking Check Availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.status(409).json({ 
        success: false, 
        message: "Room is not available for the selected dates" 
      });
    }

    // Get totalPrice from Room
    const roomData = await Room.findById(room).populate("hotel");
    
    if (!roomData) {
      return res.status(404).json({ 
        success: false, 
        message: "Room not found" 
      });
    }

    if (!roomData.isAvailable) {
      return res.status(409).json({ 
        success: false, 
        message: "Room is currently unavailable" 
      });
    }

    let totalPrice = roomData.pricePerNight;

    // Calculate totalPrice based on nights
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (nights <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid date range" 
      });
    }

    totalPrice = totalPrice * nights;

    const paymentMethodValue = paymentMethod || "Pay At Hotel";
    
    // Always create booking as unpaid - user will pay from My Bookings page
    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: guestsNum,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      paymentMethod: paymentMethodValue,
      isPaid: false, // Always unpaid initially - user pays from My Bookings
      paymentStatus: "pending",
      status: "pending", // Booking pending until payment
    });

    // Send email notification (optional - won't fail booking if email fails)
    if (process.env.SENDER_EMAIL && process.env.SENDER_PASSWORD && userEmail) {
      try {
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: userEmail,
          subject: 'Hotel Booking Confirmation - AtStay',
          html: `
              <h2>Your Booking Details</h2>
              <p>Dear ${userName},</p>
              <p>Thank you for your booking! Here are your booking details:</p>
              <ul>
                  <li><strong>Booking ID:</strong> ${booking._id}</li>
                  <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                  <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                  <li><strong>Check-in Date:</strong> ${checkIn.toLocaleDateString()}</li>
                  <li><strong>Check-out Date:</strong> ${checkOut.toLocaleDateString()}</li>
                  <li><strong>Nights:</strong> ${nights}</li>
                  <li><strong>Guests:</strong> ${booking.guests}</li>
                  <li><strong>Total Amount:</strong> ${process.env.CURRENCY || '₹'} ${booking.totalPrice}</li>
              </ul>
              <p>We look forward to welcoming you!</p>
              <p>If you need to make any changes, feel free to contact us.</p>
          `
        };

        await transporter.sendMail(mailOptions);
        // Email sent successfully - don't log in production
      } catch (emailError) {
        // Don't fail the booking if email fails - silently continue
      }
    }

    res.status(201).json({ 
      success: true, 
      message: "Booking created successfully.",
      bookingId: booking._id,
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to create booking"
    });
  }
};

// API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const user = req.user._id;
    const bookings = await Booking.find({ user })
      .populate("room hotel")
      .sort({ createdAt: -1 })
      .lean();
    
    res.status(200).json({ 
      success: true, 
      bookings: bookings || [] 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to fetch bookings" 
    });
  }
};


export const getHotelBookings = async (req, res) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.status(404).json({ 
        success: false, 
        message: "No hotel found for this user" 
      });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 })
      .lean();

    // Total Bookings
    const totalBookings = bookings.length;

    // Total Revenue (only from paid bookings)
    const totalRevenue = bookings
      .filter(booking => booking.isPaid)
      .reduce((acc, booking) => acc + (booking.totalPrice || 0), 0);

    res.status(200).json({ 
      success: true, 
      dashboardData: { 
        totalBookings, 
        totalRevenue, 
        bookings: bookings || [] 
      } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to fetch bookings" 
    });
  }
};

