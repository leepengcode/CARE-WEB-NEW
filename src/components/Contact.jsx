import React, { useEffect, useState } from "react";
import {
  FaBuilding,
  FaClock,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
  FaRegCommentDots,
  FaRegHandshake,
  FaUser,
} from "react-icons/fa";

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-4xl text-gradient mb-2" />,
      title: "Email",
      content: (
        <>
          <a
            href="mailto:director@angkorrealestate.com"
            className="hover:text-blue-600 transition-all duration-300 font-medium"
          >
            director@angkorrealestate.com
          </a>
          <br />
          <a
            href="mailto:valuationpp@angkorrealestate.com"
            className="hover:text-blue-600 transition-all duration-300 font-medium"
          >
            valuationpp@angkorrealestate.com
          </a>
        </>
      ),
    },
    {
      icon: <FaPhoneAlt className="text-4xl text-gradient mb-2" />,
      title: "Phone",
      content: (
        <>
          <a
            href="tel:+85514699289"
            className="hover:text-blue-600 transition-all duration-300 font-medium"
          >
            +855 14 699 289
          </a>
          <br />
          <a
            href="tel:+85577658687"
            className="hover:text-blue-600 transition-all duration-300 font-medium"
          >
            +855 77 658 687
          </a>
        </>
      ),
    },
    {
      icon: <FaMapMarkerAlt className="text-4xl text-gradient mb-2" />,
      title: "Address",
      content: (
        <a
          href="https://maps.app.goo.gl/HJYa5S8ZGwssS4mJ6"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-all duration-300 font-medium"
        >
          Phnom Penh, Cambodia
        </a>
      ),
    },
  ];

  const additionalInfo = [
    {
      icon: <FaBuilding className="text-2xl text-blue-600" />,
      title: "Office Hours",
      content:
        "Monday - Friday: 8:00 AM - 6:00 PM\nSaturday: 9:00 AM - 4:00 PM",
    },
    {
      icon: <FaClock className="text-2xl text-blue-600" />,
      title: "Response Time",
      content: "We typically respond within 2-4 hours during business hours",
    },
    {
      icon: <FaGlobe className="text-2xl text-blue-600" />,
      title: "Languages",
      content: "English, Khmer, Chinese",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div
          className={`relative pt-10 pb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl mb-8 animate-pulse-slow">
              <FaRegHandshake className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent p-3 mb-6 leading-tight">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Ready to find your perfect property? We're here to help you every
              step of the way.
            </p>
          </div>
        </div>

        {/* Contact Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transform transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          {contactInfo.map((card, idx) => (
            <div
              key={card.title}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-white/20 p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer transform ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
              style={{ animationDelay: `${idx * 200}ms` }}
              onMouseEnter={() => setActiveCard(idx)}
              onMouseLeave={() => setActiveCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {card.title}
                </h3>
                <div className="text-gray-600 text-lg leading-relaxed">
                  {card.content}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div
          className={`bg-white/60 backdrop-blur-sm rounded-3xl shadow-sm border border-white/20 p-8 mb-20 transform transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalInfo.map((info, idx) => (
              <div key={info.title} className="text-center group">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  {info.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {info.title}
                </h4>
                <p className="text-gray-600 whitespace-pre-line">
                  {info.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div
          className={`bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-20 transform transition-all duration-1000 delay-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Send us a Message
            </h3>
            <p className="text-gray-600">
              Fill out the form below and we'll get back to you as soon as
              possible.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group">
              <FaUser className="absolute left-4 top-4 text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors duration-300" />
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-4 text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors duration-300" />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="relative group">
              <FaRegCommentDots className="absolute left-4 top-4 text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors duration-300" />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="relative group">
              <FaPhoneAlt className="absolute left-4 top-4 text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors duration-300" />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
            </div>
            <div className="relative group md:col-span-2">
              <FaRegCommentDots className="absolute left-4 top-4 text-gray-400 text-lg group-focus-within:text-blue-600 transition-colors duration-300" />
              <textarea
                name="message"
                placeholder="Your Message"
                className="w-full pl-12 pr-4 py-4 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-gray-700 placeholder-gray-400 min-h-[150px] resize-y"
              />
            </div>
            <div className="md:col-span-2 flex justify-center">
              <button
                onClick={() => {
                  const name =
                    document.querySelector('input[name="name"]').value;
                  const email = document.querySelector(
                    'input[name="email"]'
                  ).value;
                  const subject = document.querySelector(
                    'input[name="subject"]'
                  ).value;
                  const phone = document.querySelector(
                    'input[name="phone"]'
                  ).value;
                  const message = document.querySelector(
                    'textarea[name="message"]'
                  ).value;

                  const mailtoLink = `mailto:valuationpp@angkorrealestate.com?subject=${encodeURIComponent(
                    subject
                  )}&body=${encodeURIComponent(
                    `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
                  )}`;
                  window.location.href = mailtoLink;
                }}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
              >
                <span className="flex items-center gap-2">
                  Send Message
                  <FaPaperPlane className="text-lg group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div
          className={`rounded-3xl overflow-hidden shadow-2xl border border-white/20 mb-20 transform transition-all duration-1000 delay-900 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-white/90 backdrop-blur-sm p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Find Us Here
            </h3>
            <p className="text-gray-600">
              Visit our office for a personal consultation
            </p>
          </div>
          <div className="relative overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d232.23093017096568!2d104.87492866103734!3d11.543635056590798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1i1!2skh!4v1749176624182!5m2!1i1!2skh&maptype=satellite"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="filter hover:saturate-110 transition-all duration-300"
            ></iframe>
          </div>
        </div>

        {/* Footer CTA */}
        <div
          className={`text-center pb-20 transform transition-all duration-1000 delay-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl mb-6 opacity-90">
              Let's discuss your real estate needs and find the perfect solution
              for you.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              Schedule a Consultation
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-gradient {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-180deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
}
