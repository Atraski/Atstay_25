import React, { useEffect, useState, useCallback } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import {useAppContext} from  '../context/AppContext'
import toast from 'react-hot-toast'
import { load } from '@cashfreepayments/cashfree-js'

const MyBookings = () => {
  const {axios, getToken, user} = useAppContext()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(null)
  const [cashfree, setCashfree] = useState(null)

  // Initialize Cashfree SDK
  useEffect(() => {
    const initializeCashfree = async () => {
      try {
        const cashfreeInstance = await load({
          mode: "sandbox" // Use sandbox for testing, change to "production" for live
        });
        setCashfree(cashfreeInstance);
      } catch (error) {
        console.error("Failed to initialize Cashfree SDK:", error);
      }
    };
    initializeCashfree();
  }, []);

  const fetchUserBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/bookings/user', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      
      // Now, access the `data` property from the resolved `response` object
      const { data } = response;

      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        toast.error(data.message || 'Failed to load bookings');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to load bookings';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [axios, getToken]);

  useEffect(()=>
  {
    if(user)
    {
      fetchUserBookings()
    }
  },[user, fetchUserBookings])

  // Handle Pay Now button click
  const handlePayNow = async (bookingId) => {
    try {
      setProcessingPayment(bookingId);
      
      // Check if Cashfree SDK is initialized
      if (!cashfree) {
        toast.error('Payment gateway is initializing. Please wait a moment and try again.');
        setProcessingPayment(null);
        return;
      }
      
      // Create Cashfree payment order
      const paymentResponse = await axios.post('/api/payments/create-order', 
        { bookingId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (paymentResponse.data.success && paymentResponse.data.paymentSessionId) {
        // Clean the payment session ID (remove any whitespace or invalid characters)
        let paymentSessionId = String(paymentResponse.data.paymentSessionId).trim();
        
        // Remove any duplicate "paymentpayment" suffix if present
        if (paymentSessionId.endsWith('paymentpayment')) {
          paymentSessionId = paymentSessionId.replace(/paymentpayment$/, '');
        }
        
        // Log for debugging
        console.log("Payment Session ID for checkout:", paymentSessionId);
        console.log("Payment Session ID length:", paymentSessionId.length);
        
        // Use Cashfree JS SDK to open checkout (as per documentation)
        const checkoutOptions = {
          paymentSessionId: paymentSessionId,
          redirectTarget: "_self" // Opens in same tab
        };
        
        cashfree.checkout(checkoutOptions);
      } else {
        toast.error(paymentResponse.data.message || 'Failed to create payment order');
        setProcessingPayment(null);
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message || 'Failed to initiate payment';
      toast.error(errorMessage);
      setProcessingPayment(null);
    }
  };


  return (
    <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title
        title='My-Bookings'
        subTitle='Easily manage your past, current and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks'
        align='left'
      />

      <div className='max-w-6xl mt-8 w-full text-gray-800'>
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-gray-500 text-lg">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500 text-lg">No bookings found.</p>
          </div>
        ) : (
          <>
            <div className='hidden md:grid grid-cols-3 w-full border-b border-gray-300 font-medium text-base py-3'>
              <div className='text-left'>Hotels</div>
              <div className='text-center'>Date & Timings</div>
              <div className='text-right'>Payment</div>
            </div>

            {bookings.map((booking) => (
          <div
            key={booking._id}
            className='grid grid-cols-1 md:grid-cols-3 w-full border-b border-gray-300 py-6 first:border-t gap-6'
          >
            {/* Hotel Details */}
            <div className='flex gap-4'>
              <img
                src={booking.room.images[0]}
                alt='hotel-img'
                className='w-28 h-28 md:w-36 md:h-36 rounded shadow object-cover'
              />
              <div className='flex flex-col justify-between'>
                <p className='font-playfair text-lg md:text-xl'>
                  {booking.hotel.name}{' '}
                  <span className='font-normal'>({booking.room.roomType})</span>
                </p>
                <div className='flex items-center gap-1 text-xs text-gray-500'>
                  <img src={assets.locationIcon} alt='location-icon' className='w-3 h-3' />
                  <span>{booking.hotel.address}</span>
                </div>
                <div className='flex items-center gap-1 text-xs text-gray-500'>
                  <img src={assets.guestsIcon} alt='guests-icon' className='w-3 h-3' />
                  <span>Guests: {booking.guests}</span>
                </div>
                <p className='text-sm md:text-base font-medium'>Total: ₹{booking.totalPrice}</p>
              </div>
            </div>

            {/* Date & Timings */}
            <div className='flex flex-col justify-center items-center text-sm text-gray-700'>
              <p>
                <span className='font-medium'>Check-In:</span>{' '}
                {new Date(booking.checkInDate).toDateString()}
              </p>
              <p className='mt-1'>
                <span className='font-medium'>Check-Out:</span>{' '}
                {new Date(booking.checkOutDate).toDateString()}
              </p>
            </div>

            {/* Payment Status */}
            <div className='flex flex-col items-start justify-center pt-3 pl-75'>
                <div className='flex items-center gap-2'>
                   <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                   <p className={`text-sm ${booking.isPaid ? "text-green-500" : ""}`}>
                    {booking.isPaid ? 'Paid' : "Unpaid"}
                   </p>
                </div>
                {!booking.isPaid && (
                  <button 
                    onClick={() => handlePayNow(booking._id)}
                    disabled={processingPayment === booking._id}
                    className={`px-4 py-2 mt-4 text-sm border border-gray-400
                    rounded-full hover:bg-gray-50 transition-all cursor-pointer
                    ${processingPayment === booking._id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {processingPayment === booking._id ? 'Processing...' : 'Pay Now'}
                  </button>
                )}
            </div>
           
          </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default MyBookings
