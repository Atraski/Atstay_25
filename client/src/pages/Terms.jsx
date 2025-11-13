import React from "react";

const Terms = () => (
  <div className="flex justify-center items-start bg-gray-50 min-h-[85vh] py-10 px-2 mt-20">
    <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl pt-12 md:pt-10 px-3 md:px-8 pb-8 md:pb-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 font-playfair text-orange-600">
        Terms & Conditions
      </h1>
      <div className="text-xs text-gray-400 mb-6 text-right">
        Last updated: 24/10/2025
      </div>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Acceptance of Terms</h2>
        <p className="text-gray-700">By using this website and our services, you agree to comply with these Terms & Conditions. Please read them carefully before using AtStay.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">User Responsibilities</h2>
        <p className="text-gray-700">You are responsible for providing accurate information and keeping your account details confidential. Misuse of the platform may result in suspension or termination.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Booking Policies</h2>
        <p className="text-gray-700">All bookings are subject to availability and confirmation. Please carefully read property details and cancellation terms before confirming the booking.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Cancellation Terms</h2>
        <p className="text-gray-700">Refer to our Refund Policy for details on cancellations, changes, and refund eligibility.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Liability Disclaimer</h2>
        <p className="text-gray-700">AtStay is not responsible for direct or indirect losses due to third party listings or technical issues not under our control.</p>
      </section>

      <section>
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Modification of Terms</h2>
        <p className="text-gray-700">AtStay reserves the right to modify these Terms at any time. Updates will be posted on this page.</p>
      </section>
    </div>
  </div>
);

export default Terms;
