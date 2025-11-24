import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = () => {
    try {
        const requiredVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
        const missingVars = requiredVars.filter(varName => !process.env[varName]);
        
        if (missingVars.length > 0) {
            console.warn(`⚠️ Missing Cloudinary env vars: ${missingVars.join(', ')}. Image uploads will fail.`);
            return;
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        if (process.env.NODE_ENV !== 'test') {
            console.log("✅ Cloudinary configured successfully");
        }
    } catch (error) {
        console.error("❌ Cloudinary configuration error:", error.message);
        // Don't exit - app can work without Cloudinary (just image uploads will fail)
    }
}

export default connectCloudinary;