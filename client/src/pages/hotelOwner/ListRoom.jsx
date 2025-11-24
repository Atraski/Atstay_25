import React, { useState, useEffect, useCallback } from "react";
import Title from "../../components/Title";
import { useAppContext } from '../../context/AppContext';
import { toast } from "react-hot-toast";

const ListRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const { axios, getToken, user, currency } = useAppContext();

    // Fetch Rooms of the Hotel Owner
    const fetchRooms = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/rooms/owner', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });

            if (data.success) {
                setRooms(data.rooms || []);
            } else {
                toast.error(data.message || 'Failed to load rooms');
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error.message || 'Failed to load rooms';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [axios, getToken]);

    // Toggle Availability of the Room
    const toggleAvailability = async (roomId) => {
        // --- OPTIMISTIC UI UPDATE ---
        // Instantly update the UI for a snappy user experience
        setRooms(prevRooms =>
            prevRooms.map(room =>
                room._id === roomId ? { ...room, isAvailable: !room.isAvailable } : room
            )
        );

        // --- API CALL WITH TRY...CATCH ---
        try {
            const { data } = await axios.post('/api/rooms/toggle-availability',
                { roomId },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                toast.success(data.message);
                // No need to call fetchRooms() again because we updated the UI optimistically
            } else {
                toast.error(data.message);
                // If the API call fails, revert the change in the UI
                fetchRooms();
            }
        } catch (error) {
            toast.error("Failed to update status.");
            // Revert the change if there's an error
            fetchRooms();
        }
    };

    useEffect(() => {
        if (user) {
            fetchRooms();
        }
    }, [user, fetchRooms]);

    return (
        <div>
            <Title
                align="left"
                font="outside"
                title="Room Listings"
                subTitle="View, edit or manage all the listed rooms. Keep the information up-to-date to provide the best experience for users"
            />

            <p className="text-gray-500 mt-8">All Rooms</p>

            {loading ? (
                <div className="py-10 text-center">
                    <p className="text-gray-500">Loading rooms...</p>
                </div>
            ) : rooms.length === 0 ? (
                <div className="py-10 text-center">
                    <p className="text-gray-500">No rooms found. Add your first room!</p>
                </div>
            ) : (
                <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
                                <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                                    Facility
                                </th>
                                <th className="py-3 px-4 text-gray-800 font-medium">
                                    Price / Night
                                </th>
                                <th className="py-3 px-4 text-gray-800 font-medium text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {rooms.map((item) => (
                                <tr key={item._id}>
                                    <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                                        {item.roomType}
                                    </td>
                                    <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">
                                        {item.amenities.join(", ")}
                                    </td>
                                    <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                                       {currency} {item.pricePerNight}
                                    </td>
                                    <td className="py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center">
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                            <input
                                                onChange={() => toggleAvailability(item._id)}
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={item.isAvailable}
                                            />
                                            <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            )}
        </div>
    );
};

export default ListRoom;