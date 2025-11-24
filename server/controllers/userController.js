



//GET /api/user

export const getUserData = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        
        res.status(200).json({ 
            success: true, 
            user: {
                role,
                recentSearchedCities
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to fetch user data" 
        });
    }
}

// Store user Recent Searched Cities

export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCity } = req.body;
        
        // Validation
        if (!recentSearchedCity || typeof recentSearchedCity !== 'string' || !recentSearchedCity.trim()) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid city name" 
            });
        }

        const user = req.user; // req.user is already a User object, not a Promise

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        const city = recentSearchedCity.trim();

        // Remove duplicate if exists
        user.recentSearchedCities = user.recentSearchedCities.filter(c => c !== city);

        // Add to beginning (most recent first)
        user.recentSearchedCities.unshift(city);

        // Keep only last 3
        if (user.recentSearchedCities.length > 3) {
            user.recentSearchedCities = user.recentSearchedCities.slice(0, 3);
        }

        await user.save();
        res.status(200).json({ 
            success: true, 
            message: "City added successfully",
            recentSearchedCities: user.recentSearchedCities
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to store city" 
        });
    }
}