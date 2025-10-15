import User from "../models/User.js";




//Middleware to check if user is authenticated

export const protect = async (req, res, next) => {
    const {userId} = req.auth;

    if (!userId) {
        res.json({ success: false, message: "Not authorized, userId missing" });
    } 

    else 
    {
        const user = await User.findById(userId);
        req.user = user; // Attach user to request object
        next();
        
    }



}