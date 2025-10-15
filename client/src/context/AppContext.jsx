import axios from "axios";
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth }from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { useState, useContext } from "react";
axios.defaults.baseURL = import.meta.env.BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({children})=>
{
    const currency = import.meta.env.CURRENCY || '₹';
    const navigate = useNavigate();
    const {user} = useUser();
    const {getToken} = useAuth();


    const [isOwner, setIsOwner] = useState(false);
    const [showHotelReg, setShowHotelReg] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);
    const [rooms, setRooms] = useState([])

    const fetchRooms = async() =>
    {
        try {
            const { data } = await axios.get('/api/rooms')
            if(data.success)
            {
                setRooms(data.rooms)
            }
            else 
            {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    // Naya function jo ek room ko ID se fetch karega
   const fetchRoomById = async (roomId) => {
    try {
        const { data } = await axios.get(`/api/rooms/${roomId}`);
        if (data.success) {
            return data.room; // Yeh room ka data return karega
        } else {
            toast.error(data.message);
            return null;
        }
    } catch (error) {
        toast.error(error.message);
        return null;
    }
   };
    
    const fetchUser = async ()=>
        {
            try {
              const {data} = await axios.get('/api/user', {headers:{Authorization: `Bearer ${await getToken()}`}})
              if(data.success)
              {
                setIsOwner(data.role === 'hotelOwner');
                setSearchedCities(data.recentSearchedCities)

              }
              else
                {
                    //Retry Fetching User Details  after 5 Seconds
                    setTimeout(()=>
                        {
                            fetchUser();

                    },5000)

              }
            } catch (error) {
                toast.error(error.message);
                
                
            }
        } 
        useEffect(()=>
        {
            if(user)
            {
                fetchUser();
            }
             
        }, [user])

        useEffect(()=>
        {
            fetchRooms();

        }, [])

    const value =
    {
        currency,
        navigate,
        user,
        getToken,
        isOwner, setIsOwner, axios,
        showHotelReg, setShowHotelReg, searchedCities, setSearchedCities,
        rooms, setRooms,fetchRoomById
        
    }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

export const useAppContext = ()=> useContext(AppContext);