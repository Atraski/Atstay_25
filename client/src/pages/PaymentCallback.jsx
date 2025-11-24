import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getToken, axios } = useAppContext();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get('order_id');
        const bookingId = searchParams.get('bookingId');

        if (!orderId) {
          toast.error('Payment verification failed - Order ID missing');
          navigate('/my-bookings');
          return;
        }

        const response = await axios.get(`/api/payments/verify/${orderId}`, {
          headers: { Authorization: `Bearer ${await getToken()}` }
        });

        if (response.data.success) {
          if (response.data.isPaid) {
            toast.success('Payment successful! Booking confirmed.');
            setTimeout(() => {
              navigate('/my-bookings');
            }, 2000);
          } else {
            toast.error('Payment failed or pending. Please try again.');
            navigate('/my-bookings');
          }
        } else {
          toast.error('Payment verification failed');
          navigate('/my-bookings');
        }
      } catch (error) {
        const errorMessage = error?.response?.data?.message || error.message || 'Error verifying payment';
        toast.error(errorMessage);
        navigate('/my-bookings');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, axios, getToken]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        {verifying ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Verifying Payment...</h2>
            <p className="text-gray-600">Please wait while we confirm your payment.</p>
          </>
        ) : (
          <>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Redirecting...</h2>
            <p className="text-gray-600">Taking you to your bookings page.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;


