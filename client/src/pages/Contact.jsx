import React from "react";

const Contact = () => (
  <div className="flex justify-center items-start bg-gray-50 min-h-[85vh] py-10 px-2">
    <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl pt-12 md:pt-10 px-3 md:px-8 pb-8 md:pb-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 font-playfair text-orange-600">
        Contact Us
      </h1>
      <div className="text-xs text-gray-400 mb-6 text-right">
        Last updated: 24/10/2025
      </div>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Our Support Team</h2>
        <p className="text-gray-700">Have questions or feedback? Reach our team for anything related to bookings or our website.</p>
      </section>
      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Contact Details</h2>
        <div className="bg-orange-50 rounded-lg p-5 text-gray-800 mb-2">
          <div className="mb-2"><span className="font-bold">Email:</span> <span className="underline text-orange-600">communications@atstay.in</span></div>
        </div>
      </section>
    </div>
  </div>
);

export default Contact;
