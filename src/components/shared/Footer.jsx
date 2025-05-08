import React, { useEffect, useRef } from "react";

const Footer = () => {
  const scrollRef = useRef(null);
  const scrollSpeed = 1; // Adjust scroll speed
  const scrollInterval = 30; // Adjust smoothness

  // Auto-scroll effect
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollPosition = 0;
    const maxScroll = container.scrollWidth - container.clientWidth;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0; // Reset to start for infinite loop
      }
      container.scrollLeft = scrollPosition;
    };

    const interval = setInterval(scroll, scrollInterval);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Tab-to-scroll functionality
  const handleKeyDown = (e) => {
    const container = scrollRef.current;
    if (!container) return;

    if (e.key === "Tab") {
      e.preventDefault(); // Prevent default tab behavior
      const scrollAmount = 100; // Adjust scroll distance per tab
      if (e.shiftKey) {
        // Shift + Tab to scroll left
        container.scrollLeft -= scrollAmount;
      } else {
        // Tab to scroll right
        container.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <div className="w-full mx-auto py-4 md:py-5 md:px-6 bg-gray-100">
      {/* Bank Logos Section */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-hidden whitespace-nowrap py-4"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{ outline: "none" }}
      >
        <div className="inline-flex space-x-6 px-4">
          <img
            src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_005.jpeg"
            alt="CIMB Bank"
            className="h-15 object-contain"
          />
          <img
            src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_001.jpg"
            alt="Kookmin Bank"
            className="h-15 object-contain"
          />
          <img
            src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_002.jpeg"
            alt="Rural Development Bank"
            className="h-15 object-contain"
          />
          <img
            src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_003.jpeg"
            alt="Maybank"
            className="h-15 object-contain"
          />
          <img
            src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_0011.jpeg"
            alt="Prince"
            className="h-15 object-contain"
          />
          <img
            src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_0011.jpeg"
            alt="Prince"
            className="h-15 object-contain"
          />
          <img
            src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_0011.jpeg"
            alt="Prince"
            className="h-15 object-contain"
          />
          <img
            src="https://www.angkorrealestate.com/wp-content/themes/care/img/bank_0011.jpeg"
            alt="Prince"
            className="h-15 object-contain"
          />
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700 py-6">
        {/* About C-A-R-E */}
        <div>
          <h3 className="text-lg font-semibold mb-2">About C-A-R-E</h3>
          <p className="text-sm">
            Cambodia Angkor Real Estate Co., Ltd. (IC-A-R-E) was the first
            company of its kind to be licensed by the Royal Government of
            Cambodia. Our operator's license was granted on 8th January 2002 and
            since then our company has gone from strength to strength.
          </p>
        </div>

        {/* Recent Post */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Recent Post</h3>
          <ul className="text-sm space-y-1">
            <li>» The organized their 4th forum and election for the new</li>
            <li>» 2005 Charities</li>
            <li>» Cambodia's tallest tower forced to lose a few storeys</li>
            <li>
              » Speculation, unfulfilled infrastructure pledges lead to price
            </li>
            <li>
              » Data for apartment market doesn't tally, but industry remains
            </li>
          </ul>
        </div>

        {/* Our Listings */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Our Listings</h3>
          <ul className="text-sm space-y-1">
            <li>» Apartment</li>
            <li>» Boutique</li>
            <li>» BUSINESS</li>
            <li>» COMMERCIAL</li>
            <li>» Guest House</li>
          </ul>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-900 text-white py-3 px-4 text-sm flex justify-center items-center">
        <span>Copyright 2002 | Angkor Real Estate. All Rights Reserved.</span>
      </div>
    </div>
  );
};

export default Footer;
