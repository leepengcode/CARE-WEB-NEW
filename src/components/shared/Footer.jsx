import React, { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleWheelEvent = (e) => {
    e.preventDefault();
    const container = scrollRef.current;
    if (!container) return;

    const deltaX = e.deltaX || 0;
    const deltaY = e.deltaY || 0;
    const scrollAmount = deltaX !== 0 ? deltaX : deltaY;

    container.scrollLeft += scrollAmount;
  };

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // Reduced speed for smoother scrolling
    let animationId;

    const scroll = () => {
      if (isHovered) {
        // If hovered, just request next frame without scrolling
        animationId = requestAnimationFrame(scroll);
        return;
      }

      const maxScroll = container.scrollWidth - container.clientWidth;

      if (maxScroll > 0) {
        scrollPosition += scrollSpeed;
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0; // Reset to start for infinite loop
        }
        container.scrollLeft = scrollPosition;
      }

      animationId = requestAnimationFrame(scroll);
    };

    // Mouse wheel event handler
    const handleWheel = (e) => {
      // Only prevent default if we're actually scrolling
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll > 0) {
        e.preventDefault();

        // Use deltaX for horizontal scroll, deltaY for vertical scroll
        const deltaX = e.deltaX || 0;
        const deltaY = e.deltaY || 0;

        // If deltaX is available, use it; otherwise use deltaY
        const scrollAmount = deltaX !== 0 ? deltaX : deltaY;

        container.scrollLeft += scrollAmount;
      }
    };

    // Add mouse wheel event listener with capture
    container.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });

    // Start scrolling
    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      container.removeEventListener("wheel", handleWheel, { capture: true });
    };
  }, [isHovered]);

  const categories = [
    { name: "Residential", to: "/residential" },
    { name: "Commercial", to: "/commercial" },
    { name: "Industrial", to: "/industrial" },
    { name: "Agriculture", to: "/agriculture" },
    { name: "Land", to: "/land" },
    { name: "Building", to: "/high-building" },
    { name: "Condo", to: "/condo" },
    { name: "Business", to: "/business-for-sell" },
  ];

  const pages = [
    { name: "About", to: "/about" },
    { name: "Article", to: "/article" },
    { name: "Favorite", to: "/favorites" },
    { name: "Mortgage", to: "/mortgage-calculator" },
    { name: "Agency", to: "/agency" },
    { name: "Valuation", to: "/valuation" },
    { name: "Certificate ", to: "/Certificate " },
  ];

  const socialLinks = [
    {
      icon: <FaFacebookF />,
      url: "https://www.facebook.com/profile.php?id=100086669414097",
      label: "Facebook",
    },
    {
      icon: <FaInstagram />,
      url: "https://www.instagram.com/cambodiaangkorrealestate/",
      label: "Instagram",
    },
    {
      icon: <FaTiktok />,
      url: "https://www.tiktok.com/@cambodiaangkorrealestate",
      label: "TikTok",
    },
    { icon: <FaYoutube />, url: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <div className="w-full bg-gray-300">
      {/* Bank Logos Section */}
      <div className="w-full bg-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
            Our Partners
          </h3>
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-4 hide-scrollbar cursor-grab active:cursor-grabbing"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onWheel={handleWheelEvent}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <img
              src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_005.jpeg"
              alt="CIMB Bank"
              className="h-6 md:h-12  w-auto  object-contain"
            />
            <img
              src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_001.jpg"
              alt="Kookmin Bank"
              className="h-6 md:h-12   w-auto object-contain"
            />
            <img
              src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_002.jpeg"
              alt="Rural Development Bank"
              className="h-6 md:h-12  w-auto object-contain"
            />
            <img
              src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_003.jpeg"
              alt="Maybank"
              className="h-6 md:h-12  w-auto object-contain"
            />
            <img
              src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_009.jpeg"
              alt="Prince"
              className="h-6 md:h-12   w-auto object-contain"
            />
            <img
              src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_0011.jpeg"
              alt="Prince"
              className="h-6 md:h-12   w-auto object-contain"
            />
            <img
              src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_0013.jpeg"
              alt="Prince"
              className="h-6 md:h-12  w-auto object-contain"
            />
            <img
              src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_0014.jpeg"
              alt="Prince"
              className="h-6 md:h-12  w-auto object-contain"
            />
            <img
              src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_001.jpg"
              alt="Prince"
              className="h-6 md:h-12  w-auto object-contain"
            />
            <img
              src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_002.jpeg"
              alt="Prince"
              className="h-6 md:h-12 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              About C-A-R-E
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Cambodia Angkor Real Estate Co., Ltd. (IC-A-R-E) was the first
              company of its kind to be licensed by the Royal Government of
              Cambodia. Our operator's license was granted on 8th January 2002
              and since then our company has gone from strength to strength.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-row gap-40">
            {/* Categories Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Categories
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => navigate(category.to)}
                    className="text-gray-600 hover:text-blue-600 text-sm text-left transition-colors"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Pages Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Pages
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {pages.map((page) => (
                  <button
                    key={page.name}
                    onClick={() => navigate(page.to)}
                    className="text-gray-600 hover:text-blue-600 text-sm text-left transition-colors"
                  >
                    {page.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-gray-900 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>
            Copyright © 2002 - {new Date().getFullYear()} | Angkor Real Estate.
            All Rights Reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-behavior: smooth;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        .hide-scrollbar:hover {
          scroll-behavior: auto;
        }
        .hide-scrollbar:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default Footer;
