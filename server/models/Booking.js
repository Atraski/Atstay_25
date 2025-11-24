import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user:
    {
        type:String,
        ref: "User",
        required:true
    },

    room:
    {
        type:String,
        ref: "Room",
        required:true
    },

    hotel:
    {
        type:String,
        ref: "Hotel",
        required:true
    },

    checkInDate:
    {
        type:Date,
        required:true
    },

    checkOutDate:
    {
        type:Date,
        required:true
    },

    totalPrice: 
    {
        type:Number,
        required:true, 
        
    },

    guests: 
    {
        type:Number, 
        required:true
    },

    status: 
    {
        type:String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    
    },

    paymentMethod: 
    {
        type:String,
        required:true,
        default: "Pay At Hotel",
    },

    isPaid: 
    {
        type:Boolean,
        default:false
    },

    paymentId: 
    {
        type:String,
        default:null
    },

    paymentStatus: 
    {
        type:String,
        enum: ["pending", "success", "failed"],
        default: "pending"
    },
    


},{timestamps: true});

// Indexes for better query performance
bookingSchema.index({ user: 1 });
bookingSchema.index({ room: 1 });
bookingSchema.index({ hotel: 1 });
bookingSchema.index({ checkInDate: 1, checkOutDate: 1 }); // For availability queries
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;