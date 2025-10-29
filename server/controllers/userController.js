



//GET /api/user

export const getUserData = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        
        res.json({ 
            success: true, 
            user: {
                role,
                recentSearchedCities
            }
        });

    } catch (error) {
        console.log("getUserData error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Store user Recent Searched Cities

export const storeRecentSearchedCities = async (req, res) => {
    try {
        const {recentSearchedCity} = req.body;
        const user = await req.user;

        if(user.recentSearchedCities.length < 3)
        {
            user.recentSearchedCities.push(recentSearchedCity)
        }
        else
        {
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCity)

        }
        await user.save();
        res.json({ success: true, message : "City Added"});

    }
    catch (error) {

        res.json({ success: false, message: error.message });

    }
}