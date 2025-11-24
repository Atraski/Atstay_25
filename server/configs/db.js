import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not set');
        }

        mongoose.connection.on("connected", () => {
            if (process.env.NODE_ENV !== 'test') {
                console.log("✅ MongoDB connected successfully");
            }
        });

        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected");
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`, {
            serverSelectionTimeoutMS: 5000,
        });
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        // Don't exit in test environment
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
        throw error;
    }
}

export default connectDB;