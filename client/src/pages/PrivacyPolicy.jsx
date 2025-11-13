import React from "react";

const PrivacyPolicy = () => (
  <div className="flex justify-center items-start bg-gray-50 min-h-[85vh] py-10 px-2 mt-20">
    <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl pt-12 md:pt-10 px-3 md:px-8 pb-8 md:pb-12">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 font-playfair text-orange-600">
        Privacy Policy
      </h1>
      <div className="text-xs text-gray-400 mb-6 text-right">
        Last updated: 24/10/2025
      </div>

      <p className="mb-6 text-gray-700 text-lg">
        AtStay is committed to protecting your information. This notice provides details about the data we collect, how we use it, and how we keep it safe. It also explains your <span className="font-bold text-black">rights</span> and how to <span className="text-orange-600 font-bold">contact us</span> if you have any questions.
      </p>

      <hr className="my-5"/>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Information We Collect</h2>
        <p className="text-gray-700 mb-2">
          We collect information you provide when you register, book, submit a review, or contact us. This may include:
        </p>
        <ul className="list-disc pl-6 text-gray-700 text-base">
          <li>Name, email, phone number</li>
          <li>Payment and transaction data</li>
          <li>Booking details</li>
          <li>Device & log information (automatically as you browse)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">How We Use Your Information</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Process bookings and deliver services</li>
          <li>Contact you about bookings, promotions, and updates</li>
          <li>Improve our website and customer experience</li>
          <li>Detect and prevent fraud or abuse</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Cookies & Tracking</h2>
        <p className="text-gray-700">We use cookies to make our website work efficiently and to analyze trends. You can control cookie preferences in your browser.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Third Party Services</h2>
        <p className="text-gray-700">We may share some information with trusted partners (like payment providers) as necessary to deliver our services, always with strict controls.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Data Security</h2>
        <p className="text-gray-700">We use modern security measures—encryption, secure servers—to protect your data. Only authorized staff can access personal info.</p>
      </section>

      <section className="mb-8">
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Your Rights</h2>
        <p className="text-gray-700">You can request access to your data, correct it, or ask for deletion at any time—just contact us at the email below.</p>
      </section>

      <section>
        <h2 className="font-semibold text-xl text-orange-600 mb-2">Contact Us</h2>
        <p className="text-gray-700">
          Questions? Reach us at{" "}
          <span className="underline text-orange-600">support@atstay.in</span>
        </p>
      </section>
    </div>
  </div>
);

export default PrivacyPolicy;
