import axios from "axios";
import { createContext, useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

// ✅ Vite envs
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const CURRENCY = import.meta.env.VITE_CURRENCY || "₹";

// ✅ Base URL set (optional: withCredentials if cookies use hoti hain)
axios.defaults.baseURL = API_BASE;
// axios.defaults.withCredentials = true; // only if you use cookies

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = CURRENCY;
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/rooms");
      if (data.success) setRooms(data.rooms);
      else toast.error(data.message || "Failed to load rooms");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Request failed");
    }
  }, []);

  const fetchRoomById = useCallback(async (roomId) => {
    try {
      const { data } = await axios.get(`/api/rooms/${roomId}`);
      if (data.success) return data.room;
      toast.error(data.message || "Failed to load room");
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Request failed");
      return null;
    }
  }, []);

  const fetchUser = useCallback(async (retryCount = 0) => {
    const MAX_RETRIES = 3;
    try {
      const token = await getToken();
      if (!token) return; // Exit if no token
      
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success && data.user) {
        setIsOwner(data.user.role === "hotelOwner");
        setSearchedCities(data.user.recentSearchedCities || []);
      } else if (retryCount < MAX_RETRIES) {
        setTimeout(() => fetchUser(retryCount + 1), 5000);
      }
    } catch (error) {
      // Silently handle user fetch errors - don't spam user with toasts
      if (retryCount < MAX_RETRIES) {
        setTimeout(() => fetchUser(retryCount + 1), 5000);
      }
    }
  }, [getToken]);

  useEffect(() => {
    if (!API_BASE) {
      // Only warn in development
      if (import.meta.env.DEV) {
        console.warn("VITE_BACKEND_URL is missing!");
      }
    }
  }, []);

  useEffect(() => {
    if (user) fetchUser();
  }, [user, fetchUser]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner, setIsOwner, axios,
    showHotelReg, setShowHotelReg,
    searchedCities, setSearchedCities,
    rooms, setRooms,
    fetchRoomById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
