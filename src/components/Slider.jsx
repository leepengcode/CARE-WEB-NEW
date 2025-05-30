import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { fetchSlider } from "../api/sliderApi";
import PageComponents from "./PageComponents";

// ✅ Skeleton Slider Component
const SkeletonSlider = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg aspect-[22/9]">
      {/* Still placeholder image */}
      <div className="absolute inset-0 z-0"></div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 animate-pulse z-10" />

      {/* Loading spinner */}
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-20">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>

      {/* Fake navigation arrows */}
      <div className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-gray-200 bg-opacity-40 text-gray-400 p-2 sm:p-3 rounded-full shadow-md z-30">
        <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-gray-200 bg-opacity-40 text-gray-400 p-2 sm:p-3 rounded-full shadow-md z-30">
        <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    </div>
  );
};

const Slider = () => {
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const data = await fetchSlider();
        const socialLinks = [
          "https://www.facebook.com/test",
          "https://t.me/test",
          "https://www.youtube.com/test",
          "https://www.instagram.com/test",
        ];

        const dataWithLinks = (data || []).map((slide, index) => ({
          ...slide,
          link: socialLinks[index % socialLinks.length],
        }));

        setSliderData(dataWithLinks);

        if (dataWithLinks.length > 0) {
          const slideInterval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % dataWithLinks.length);
          }, 5000);
          setIntervalId(slideInterval);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching slider data:", err);
        setError(
          err.message || "An error occurred while fetching slider data."
        );
        setLoading(false);
      }
    };

    fetchSliderData();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  const goToNextSlide = () => {
    if (sliderData.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderData.length);
    resetAutoSlide();
  };

  const goToPreviousSlide = () => {
    if (sliderData.length === 0) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sliderData.length - 1 : prevIndex - 1
    );
    resetAutoSlide();
  };

  const resetAutoSlide = () => {
    if (sliderData.length === 0) return;
    clearInterval(intervalId);
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderData.length);
    }, 3000);
    setIntervalId(slideInterval);
  };

  const handleMouseEnter = () => {
    clearInterval(intervalId);
  };

  const handleMouseLeave = () => {
    resetAutoSlide();
  };

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setError("Failed to load image");
  };

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-0 md:py-5 lg:px-10">
        <div className="w-full flex items-center justify-center">
          <div className="w-full relative overflow-hidden rounded-lg">
            {loading ? (
              <SkeletonSlider />
            ) : error ? (
              <div className="flex items-center justify-center w-full aspect-[22/9] text-red-500 text-center px-4">
                {error}
              </div>
            ) : sliderData.length === 0 ? (
              <div className="text-center text-xl aspect-[16/9] flex items-center justify-center rounded-lg">
                No slider data available.
              </div>
            ) : (
              <div
                className="relative w-full aspect-[21/9] md:aspect-[22/9]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="flex transition-transform duration-1000"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                  ref={sliderRef}
                >
                  {sliderData.map((slide) => (
                    <div
                      key={slide.id}
                      className="w-full flex-shrink-0 rounded-lg overflow-hidden relative"
                    >
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      <img
                        src={slide.image}
                        alt={slide.property_title}
                        className="w-full h-full object-cover"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                      {slide.link && (
                        <button
                          onClick={(e) => handleLinkClick(e, slide.link)}
                          className="absolute top-2 right-2 md:top-4 md:right-4 bg-white px-2 py-1 text-sm md:text-base md:px-4 md:py-2 rounded-lg shadow-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          Contact Us
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Arrows */}
                <button
                  onClick={goToPreviousSlide}
                  className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-700 z-10"
                >
                  <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={goToNextSlide}
                  className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-700 z-10"
                >
                  <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Dot Indicators */}
                <div className="absolute md:bottom-1 bottom-3 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2 z-20">
                  {sliderData.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all duration-200 focus:outline-none ${
                        currentIndex === idx
                          ? "bg-blue-400 border-blue-400 opacity-80"
                          : "bg-white border-blue-400 opacity-90"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageComponents>
  );
};

export default Slider;
