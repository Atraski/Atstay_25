import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import axios from "axios";
import { getAuth, clerkClient } from "@clerk/express";

// Cashfree API base URL
const getCashfreeBaseUrl = () => {
  return process.env.CASHFREE_ENVIRONMENT === "SANDBOX" || process.env.CASHFREE_ENVIRONMENT === "sandbox"
    ? "https://sandbox.cashfree.com/pg"
    : "https://api.cashfree.com/pg";
};

// Helper function to make Cashfree API calls
const cashfreeApiCall = async (endpoint, method = "POST", data = null) => {
  const baseUrl = getCashfreeBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const config = {
    method,
    url,
    headers: {
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-api-version": "2023-08-01",
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  };

  if (data) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    
    // Log in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`Cashfree API ${method} ${endpoint}:`, JSON.stringify(response.data, null, 2));
    }
    
    return response.data;
  } catch (error) {
    // Better error logging
    if (error.response) {
      console.error("Cashfree API Error Response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error?.message ||
                        error.message || 
                        "Cashfree API error";
    const errorDetails = error.response?.data || {};
    throw new Error(`${errorMessage}${errorDetails.code ? ` (${errorDetails.code})` : ""}`);
  }
};

// API to create Cashfree payment order
// POST /api/payments/create-order
export const createCashfreeOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "Payment gateway not configured. Please add CASHFREE_APP_ID and CASHFREE_SECRET_KEY to your .env file.",
      });
    }

    // Verify user owns the booking
    const booking = await Booking.findById(bookingId).populate("room hotel user");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get booking user ID (handle both populated and non-populated cases)
    const bookingUserId = booking.user?._id?.toString() || booking.user?.toString() || String(booking.user);
    const currentUserId = String(req.user._id);

    if (bookingUserId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: This booking doesn't belong to you",
      });
    }

    // Check if already paid
    if (booking.isPaid) {
      return res.status(400).json({
        success: false,
        message: "Booking is already paid",
      });
    }

    const roomData = await Room.findById(booking.room).populate("hotel");

    if (!roomData) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const { origin } = req.headers;
    const frontendUrl = origin || process.env.FRONTEND_URL || "http://localhost:5173";
    const backendUrl = process.env.BACKEND_URL || origin || "http://localhost:5000";

    // Generate unique order ID
    const orderId = `ORDER_${booking._id}_${Date.now()}`;

    // Get customer ID (must be string, max 50 characters)
    const customerId = bookingUserId.length > 50 ? bookingUserId.substring(0, 50) : bookingUserId;

    // Get customer phone number from Clerk
    let customerPhone = "9999999999"; // Default placeholder
    
    try {
      const { userId } = getAuth(req);
      if (userId) {
        const clerkUser = await clerkClient.users.getUser(userId);
        const phoneNumber = clerkUser?.phoneNumbers?.[0]?.phoneNumber;
        
        if (phoneNumber) {
          // Format phone number: remove spaces, dashes, parentheses, country code
          customerPhone = phoneNumber
            .replace(/[\s\-+()]/g, "")
            .replace(/^91/, ""); // Remove India country code if present
          
          // Ensure it's exactly 10 digits
          if (customerPhone.length > 10) {
            customerPhone = customerPhone.slice(-10); // Take last 10 digits
          } else if (customerPhone.length < 10) {
            customerPhone = customerPhone.padStart(10, "9");
          }
        }
      }
    } catch (error) {
      // If Clerk fetch fails, use default phone number
    }

    // Create order request for Cashfree
    // Ensure order_amount is a number (not string)
    const orderAmount = Number(booking.totalPrice);
    
    const orderRequest = {
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: "INR",
      order_note: `Booking for ${roomData.hotel.name} - ${roomData.roomType}`.substring(0, 200),
      customer_details: {
        customer_id: customerId,
        customer_name: (req.user?.username || "Guest").substring(0, 50),
        customer_email: req.user?.email || "",
        customer_phone: customerPhone,
      },
      order_meta: {
        return_url: `${frontendUrl}/payment/callback?bookingId=${booking._id}`,
        notify_url: `${backendUrl}/api/payments/webhook`,
        payment_methods: "cc,dc,upi,nb",
      },
    };

    // Log request in development
    if (process.env.NODE_ENV === "development") {
      console.log("Cashfree Order Request:", JSON.stringify(orderRequest, null, 2));
    }

    // Create order in Cashfree via direct API call
    let orderResponse;
    try {
      orderResponse = await cashfreeApiCall("/orders", "POST", orderRequest);
      
      // Log response in development for debugging
      if (process.env.NODE_ENV === "development") {
        console.log("Cashfree Order Response:", JSON.stringify(orderResponse, null, 2));
      }
    } catch (apiError) {
      console.error("Cashfree API Error:", apiError.message);
      return res.status(500).json({
        success: false,
        message: `Cashfree API Error: ${apiError.message}`,
        details: process.env.NODE_ENV === "development" ? apiError.stack : undefined,
      });
    }

    // Check if order was created successfully
    if (!orderResponse) {
      return res.status(500).json({
        success: false,
        message: "No response from Cashfree API",
      });
    }

    // Log full response for debugging
    console.log("Full Cashfree Response:", JSON.stringify(orderResponse, null, 2));

    // Cashfree API response structure check
    // Response can have: payment_session_id, payment_link, or both
    // Sometimes it's nested in 'data' object
    const paymentSessionId = orderResponse.payment_session_id || 
                             orderResponse.data?.payment_session_id ||
                             orderResponse.session_id ||
                             orderResponse.paymentSessionId;
    
    if (paymentSessionId) {
      // Update booking with order ID
      booking.paymentId = orderId;
      booking.paymentStatus = "pending";
      await booking.save();

      // Generate payment link - Cashfree format
      // According to Cashfree docs, checkout URL should be: https://sandbox.cashfree.com/pg/checkout/{payment_session_id}
      const baseDomain = process.env.CASHFREE_ENVIRONMENT === "SANDBOX" || process.env.CASHFREE_ENVIRONMENT === "sandbox"
        ? "sandbox.cashfree.com"
        : "www.cashfree.com";
      
      // Ensure payment_session_id is properly formatted
      let cleanSessionId = String(paymentSessionId).trim();
      // Remove any whitespace, newlines, or control characters
      cleanSessionId = cleanSessionId.replace(/[\s\r\n\t]/g, '');
      
      // CRITICAL FIX: Check if session ID has duplicate "paymentpayment" at the end
      // This seems to be a Cashfree response issue - remove duplicate if present
      if (cleanSessionId.endsWith('paymentpayment')) {
        // Remove the duplicate "paymentpayment" suffix
        cleanSessionId = cleanSessionId.replace(/paymentpayment$/, '');
        if (process.env.NODE_ENV === "development") {
          console.log("⚠️  Fixed: Removed duplicate 'paymentpayment' from session ID");
        }
      }
      
      // Cashfree checkout URL format
      // IMPORTANT: According to Cashfree docs, the checkout URL should be:
      // https://sandbox.cashfree.com/pg/checkout/{payment_session_id}
      // But sometimes Cashfree returns payment_link directly - check that first
      
      // CRITICAL: Check if Cashfree provided payment_link directly
      // If payment_link is provided, use it (most reliable method)
      let paymentLink = orderResponse.payment_link;
      
      if (!paymentLink) {
        // If payment_link not provided, construct checkout URL manually
        // Cashfree checkout URL: https://sandbox.cashfree.com/pg/checkout/{payment_session_id}
        // IMPORTANT: Use session ID exactly as provided by Cashfree
        paymentLink = `https://${baseDomain}/pg/checkout/${cleanSessionId}`;
        
        // Log warning if constructing manually
        if (process.env.NODE_ENV === "development") {
          console.warn("⚠️  WARNING: payment_link not in response, constructing manually");
          console.warn("⚠️  This might cause 404 errors. Check Cashfree API response format.");
        }
      }

      // Validate payment session ID format
      if (!cleanSessionId || !cleanSessionId.startsWith('session_')) {
        console.error("❌ Invalid payment session ID format:", cleanSessionId);
        return res.status(500).json({
          success: false,
          message: "Invalid payment session ID received from Cashfree",
          details: process.env.NODE_ENV === "development" ? { raw: paymentSessionId, cleaned: cleanSessionId } : undefined,
        });
      }

      if (process.env.NODE_ENV === "development") {
        console.log("=== Payment Link Debug ===");
        console.log("Payment Session ID (raw):", paymentSessionId);
        console.log("Payment Session ID (cleaned):", cleanSessionId);
        console.log("Payment Session ID length:", cleanSessionId.length);
        console.log("Payment Session ID valid:", cleanSessionId.startsWith('session_'));
        console.log("Payment Link from Cashfree:", orderResponse.payment_link || "NOT PROVIDED");
        console.log("Generated Payment Link:", paymentLink);
        console.log("Order Status:", orderResponse.order_status);
        console.log("CF Order ID:", orderResponse.cf_order_id);
        console.log("All Response Keys:", Object.keys(orderResponse));
        console.log("==========================");
      }

      res.status(200).json({
        success: true,
        paymentSessionId: cleanSessionId, // Use cleaned session ID
        orderId: orderId,
        cfOrderId: orderResponse.cf_order_id,
        orderAmount: booking.totalPrice,
        paymentLink: paymentLink, // Keep for backward compatibility, but frontend should use paymentSessionId with SDK
        orderStatus: orderResponse.order_status,
        message: "Payment order created successfully",
      });
    } else if (orderResponse.payment_link) {
      // If payment_link is directly provided
      booking.paymentId = orderId;
      booking.paymentStatus = "pending";
      await booking.save();

      res.status(200).json({
        success: true,
        paymentSessionId: orderResponse.payment_session_id || orderId,
        orderId: orderId,
        orderAmount: booking.totalPrice,
        paymentLink: orderResponse.payment_link,
        message: "Payment order created successfully",
      });
    } else {
      // Log the full response for debugging
      console.error("Unexpected Cashfree response:", JSON.stringify(orderResponse, null, 2));
      return res.status(500).json({
        success: false,
        message: "Failed to create payment order. No payment session ID received.",
        details: process.env.NODE_ENV === "development" ? JSON.stringify(orderResponse, null, 2) : undefined,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment order",
    });
  }
};

// API to verify payment status
// GET /api/payments/verify/:orderId
export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Get order status from Cashfree via API
    const orderResponse = await cashfreeApiCall(`/orders/${orderId}`, "GET");

    if (orderResponse && orderResponse.payments) {
      const payments = orderResponse.payments;
      const latestPayment = payments[payments.length - 1];
      const paymentStatus = latestPayment.payment_status;

      // Find booking by payment ID
      const booking = await Booking.findOne({ paymentId: orderId }).populate("user");

      if (booking) {
        // Verify user owns the booking (if authenticated)
        if (req.user && req.user._id) {
          const bookingUserId = booking.user?._id?.toString() || booking.user?.toString() || String(booking.user);
          const currentUserId = String(req.user._id);
          
          if (bookingUserId !== currentUserId) {
            return res.status(403).json({
              success: false,
              message: "Unauthorized: This booking doesn't belong to you",
            });
          }
        }

        if (paymentStatus === "SUCCESS") {
          booking.isPaid = true;
          booking.paymentStatus = "success";
          booking.status = "confirmed";
          await booking.save();
        } else if (paymentStatus === "FAILED") {
          booking.paymentStatus = "failed";
          await booking.save();
        }

        res.status(200).json({
          success: true,
          paymentStatus: paymentStatus?.toLowerCase() || "pending",
          isPaid: booking.isPaid,
          booking: booking,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Booking not found for this order",
        });
      }
    } else {
      // If no payments yet, check booking status
      const booking = await Booking.findOne({ paymentId: orderId }).populate("user");
      if (booking) {
        // Verify user owns the booking (if authenticated)
        if (req.user && req.user._id) {
          const bookingUserId = booking.user?._id?.toString() || booking.user?.toString() || String(booking.user);
          const currentUserId = String(req.user._id);
          
          if (bookingUserId !== currentUserId) {
            return res.status(403).json({
              success: false,
              message: "Unauthorized: This booking doesn't belong to you",
            });
          }
        }

        res.status(200).json({
          success: true,
          paymentStatus: booking.paymentStatus,
          isPaid: booking.isPaid,
          booking: booking,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
};

// Webhook handler for Cashfree payment notifications
// POST /api/payments/webhook
export const cashfreeWebhook = async (req, res) => {
  try {
    // Cashfree sends webhook data in req.body
    const webhookData = req.body;

    const { data, event } = webhookData;

    if (event === "PAYMENT_SUCCESS" || event === "PAYMENT_USER_DROPPED") {
      const orderId = data.order?.order_id;
      const paymentStatus = data.payment?.payment_status;

      if (orderId) {
        const booking = await Booking.findOne({ paymentId: orderId });

        if (booking) {
          if (paymentStatus === "SUCCESS") {
            booking.isPaid = true;
            booking.paymentStatus = "success";
            booking.status = "confirmed";
            await booking.save();
          } else if (paymentStatus === "FAILED") {
            booking.paymentStatus = "failed";
            await booking.save();
          }
        }
      }
    }

    // Always return 200 to acknowledge webhook receipt
    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    // Still return 200 to prevent Cashfree from retrying
    res.status(200).json({
      success: false,
      message: error.message || "Webhook processing failed",
    });
  }
};

