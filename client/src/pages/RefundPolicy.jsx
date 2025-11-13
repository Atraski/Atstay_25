import React from "react";

const RefundPolicy = () => (
  <div className="flex justify-center items-start bg-gray-50 min-h-[85vh] py-10 px-2 mt-20">
    <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl pt-12 md:pt-10 px-3 md:px-8 pb-8 md:pb-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 font-playfair text-orange-600">
        Refund Policy
      </h1>
      <div className="text-xs text-gray-400 mb-6 text-right">
        Last updated: 24/10/2025
      </div>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Eligibility for Refunds</h2>
        <p className="text-gray-700">Refunds are processed subject to our cancellation policy. Non-refundable fees may apply depending on the booking terms.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">How to Request a Refund</h2>
        <p className="text-gray-700">To request a refund, contact us at the email listed below with your booking details and reason for the request.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Refund Process</h2>
        <p className="text-gray-700">Approved refunds will be processed to your original payment method within 7-14 business days.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Non-Refundable Charges</h2>
        <p className="text-gray-700">Some bookings may have non-refundable charges as specified at the time of reservation.</p>
      </section>

      <section>
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Contact for Refund Queries</h2>
        <p className="text-gray-700">Email: <span className="underline text-orange-600">support@atstay.in</span></p>
      </section>
    </div>
  </div>
);

export default RefundPolicy;
