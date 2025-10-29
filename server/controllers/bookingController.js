import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
// import stripe from "stripe";

// Function to Check Availablity of Room
const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {

  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });

    const isAvailable = bookings.length === 0;
    return isAvailable;

  } catch (error) {
    console.error(error.message);
  }
};

// API to check availability of room
// POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// API to create a new booking
// POST /api/bookings/book
export const createBooking = async (req, res) => {
  try {
    console.log("=== BOOKING REQUEST START ===");
    console.log("Request body:", req.body);
    console.log("User:", req.user);
    console.log("=============================");

    const { room, checkInDate, checkOutDate, guests } = req.body;

    // Validate required fields
    if (!room || !checkInDate || !checkOutDate || !guests) {
      return res.json({ 
        success: false, 
        message: "Missing required fields: room, checkInDate, checkOutDate, guests" 
      });
    }

    // Handle both authenticated and guest bookings
    let user = null;
    let userEmail = null;
    let userName = null;

    if (req.user && req.user._id) {
      // Authenticated user
      user = req.user._id;
      userEmail = req.user.email;
      userName = req.user.username;
    } else {
      // Guest booking - require email in request body
      const { guestEmail, guestName } = req.body;
      if (!guestEmail) {
        return res.json({ 
          success: false, 
          message: "Please provide email for booking",
          requiresLogin: true
        });
      }
      userEmail = guestEmail;
      userName = guestName || "Guest";
    }

    // Before Booking Check Availability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    // Get totalPrice from Room
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    // Calculate totalPrice based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    // Send email notification (optional - won't fail booking if email fails)
    if (process.env.SENDER_EMAIL && process.env.SENDER_PASSWORD) {
      try {
        console.log("Sending email to:", userEmail);
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: userEmail,
          subject: 'Hotel Booking Details',
          html: `
              <h2>Your Booking Details</h2>
              <p>Dear ${userName}, </p>
              <p>Thank you for your booking! Here are your booking details:</p>
              <ul>
                  <li><strong>Booking ID:</strong> ${booking._id}</li>
                  <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                  <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                  <li><strong>Check-in Date:</strong> ${booking.checkInDate.toString()}</li>
                  <li><strong>Check-out Date:</strong> ${booking.checkOutDate.toString()}</li>
                  <li><strong>Guests:</strong> ${booking.guests}</li>
                  <li><strong>Total Amount:</strong> ${process.env.CURRENCY || '₹'} ${booking.totalPrice}</li>
              </ul>
              <p>We look forward to welcoming you!</p>
              <p>If you need to make any changes, feel free to contact us.</p>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
      } catch (emailError) {
        console.log("Email sending failed:", emailError.message);
        console.log("Booking will still be created successfully");
        // Don't fail the booking if email fails
      }
    } else {
      console.log("Email configuration not found - skipping email notification");
    }

    // const mailOptions = {
    //   from: process.env.SENDER_EMAIL,
    //   to: req.user.email,
    //   subject: 'Hotel Booking Details',
    //   html: `
    //     <h2>Your Booking Details</h2>
    //     <p>Dear ${req.user.username},</p>
    //     <p>Thank you for your booking! Here are your details:</p>
    //     <ul>
    //       <li><strong>Booking ID:</strong> ${booking.id}</li>
    //       <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
    //       <li><strong>Location:</strong> ${roomData.hotel.address}</li>
    //       <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
    //       <li><strong>Booking Amount:</strong>  ${process.env.CURRENCY || '$'} ${booking.totalPrice} /night</li>
    //     </ul>
    //     <p>We look forward to welcoming you!</p>
    //     <p>If you need to make any changes, feel free to contact us.</p>
    //   `,
    // };

    // await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Booking created successfully" });

  } catch (error) {
    console.log("=== BOOKING ERROR DETAILS ===");
    console.log("Error message:", error.message);
    console.log("Error stack:", error.stack);
    console.log("Request body:", req.body);
    console.log("User:", req.user);
    console.log("=============================");
    
    res.json({ 
      success: false, 
      message: "Failed to create booking",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// API to get all bookings for a user
// GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;
    const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};


export const getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: "No Hotel found" });
    }
    const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 });
    // Total Bookings
    const totalBookings = bookings.length;

    // Total Revenue
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);


    res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};


// export const stripePayment = async (req, res) => {
//   try {

//     const { bookingId } = req.body;

//     const booking = await Booking.findById(bookingId);
//     const roomData = await Room.findById(booking.room).populate("hotel");
//     const totalPrice = booking.totalPrice;

//     const { origin } = req.headers;

//     const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

//     // Create Line Items for Stripe
//     const line_items = [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: roomData.hotel.name,
//           },
//           unit_amount: totalPrice * 100,
//         },
//         quantity: 1,
//       },
//     ];

//     // Create Checkout Session
//     const session = await stripeInstance.checkout.sessions.create({
//       line_items,
//       mode: "payment",
//       success_url: `${origin}/loader/my-bookings`,
//       cancel_url: `${origin}/my-bookings`,
//       metadata: {
//         bookingId,
//       },
//     });
//     res.json({ success: true, url: session.url });

//   } catch (error) {
//     res.json({ success: false, message: "Payment Failed" });
//   }
// }