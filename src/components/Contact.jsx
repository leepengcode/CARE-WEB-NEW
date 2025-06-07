import React from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import PageComponents from "./PageComponents";

const contactInfo = [
  {
    icon: <FaEnvelope className="text-4xl text-red-500 mb-2" />,
    title: "Email",
    content: (
      <>
        <a
          href="mailto:director@angkorrealestate.com"
          className="hover:text-red-500 transition-colors"
        >
          director@angkorrealestate.com
        </a>
        <br />
        <a
          href="mailto:valuationpp@angkorrealestate.com"
          className="hover:text-red-500 transition-colors"
        >
          valuationpp@angkorrealestate.com
        </a>
      </>
    ),
  },
  {
    icon: <FaPhoneAlt className="text-4xl text-red-500 mb-2" />,
    title: "Phone",
    content: (
      <>
        <a
          href="tel:+85514699289"
          className="hover:text-red-500 transition-colors"
        >
          +855-14 699 289
        </a>
        <br />
        <a
          href="tel:+85577658687"
          className="hover:text-red-500 transition-colors"
        >
          +855-77 658 687
        </a>
      </>
    ),
  },
  {
    icon: <FaMapMarkerAlt className="text-4xl text-red-500 mb-2" />,
    title: "Address",
    content: (
      <a
        href="https://maps.app.goo.gl/HJYa5S8ZGwssS4mJ6"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-red-500 transition-colors"
      >
        St #206, Ou Baek K'am District, Sen Sok Commune, Phnom Penh, Cambodia
      </a>
    ),
  },
];

export default function Contact() {
  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto min-h-[80vh] flex flex-col justify-between py-4 md:py-8 px-2 md:px-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-blue-900 animate-fade-in-up">
          Get in Touch With Us
        </h2>
        <p className="mb-6 text-gray-600 animate-fade-in-up">
          We're here to help you with your real estate needs. Contact us for
          property inquiries, partnership opportunities, or any questions you
          may have!
        </p>
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {contactInfo.map((card, idx) => (
            <div
              key={card.title}
              className="bg-blue-50 rounded-xl shadow-md p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {card.icon}
              <h3 className="text-xl font-bold text-blue-900 mb-2">
                {card.title}
              </h3>
              <div className="text-gray-700 text-md">{card.content}</div>
            </div>
          ))}
        </div>
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-fade-in-up">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Contact Us</h3>
          <form
            action="https://formspree.io/f/xwkgyyqk"
            method="POST"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input type="hidden" name="_subject" value="New Contact Message" />
            <input
              type="text"
              name="name"
              placeholder="Name*"
              className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email*"
              className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject*"
              className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200 md:col-span-1"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200 md:col-span-1"
            />
            <textarea
              name="message"
              placeholder="Message*"
              className="border rounded px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200 md:col-span-2 min-h-[120px]"
              required
            />
            <div className="md:col-span-2 flex">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded transition-all duration-200 shadow-md"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
        {/* Google Map */}
        <div className="w-full rounded-xl overflow-hidden shadow-md animate-fade-in-up">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d232.23093017096568!2d104.87492866103734!3d11.543635056590798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTHCsDMyJzM3LjMiTiAxMDTCsDUyJzI5LjkiRQ!5e1!3m2!1sen!2skh!4v1749176624182!5m2!1sen!2skh"
            width="1200"
            height="450"
            style={{ border: 0 }}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
    </PageComponents>
  );
}
