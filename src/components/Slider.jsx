import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import PageComponents from "./PageComponents";

// Skeleton Slider Component for Loading State
const SkeletonSlider = () => {
  return (
    <div className="relative overflow-hidden h-72">
      <div className="flex">
        <div className="w-full flex-shrink-0 bg-blue-500 opacity-40 rounded-lg shadow-lg overflow-hidden">
          <div className="w-full h-72 bg-blue-500 animate-shimmer"></div>
        </div>
      </div>
      <div className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-blue-300 bg-opacity-40 text-gray-300 p-2 sm:p-3 rounded-full shadow-lg z-10">
        <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-gray-300 bg-opacity-60 text-gray-300 p-2 sm:p-3 rounded-full shadow-lg z-10">
        <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
    </div>
  );
};

const Slider = () => {
  const { userToken } = useStateContext();
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);
  const [intervalId, setIntervalId] = useState(null);
  const navigate = useNavigate();

  // Use useInView for slide-up animation
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        // Add timeout to the fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const res = await fetch("http://localhost:8001/api/get_slider_public", {
          method: "GET",
        });

        clearTimeout(timeoutId);

        const data = await res.json();
        if (data.error) {
          setError(data.message);
        } else {
          // Add test social media links to the slider data
          const dataWithLinks = (data.data || []).map((slide, index) => {
            const socialLinks = [
              "https://www.facebook.com/test",
              "https://t.me/test",
              "https://www.youtube.com/test",
              "https://www.instagram.com/test",
            ];
            return {
              ...slide,
              link: socialLinks[index % socialLinks.length],
            };
          });
          setSliderData(dataWithLinks);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching slider data:", err);
        if (err.name === "AbortError") {
          setError("Request timed out. Please try again.");
        } else if (
          err.name === "TypeError" &&
          err.message === "Failed to fetch"
        ) {
          setError(
            "Unable to connect to the server. Please check your internet connection."
          );
        } else {
          setError(
            err.message || "An error occurred while fetching slider data."
          );
        }
        setLoading(false);
      }
    };

    fetchSliderData();

    // Auto slide functionality
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sliderData.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    setIntervalId(slideInterval);

    return () => clearInterval(slideInterval);
  }, [userToken]);

  const goToNextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === sliderData.length - 1 ? 0 : prevIndex + 1
    );
    resetAutoSlide();
  };

  const goToPreviousSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sliderData.length - 1 : prevIndex - 1
    );
    resetAutoSlide();
  };

  const resetAutoSlide = () => {
    clearInterval(intervalId);
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === sliderData.length - 1 ? 0 : prevIndex + 1
      );
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

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-0 md:py-5 md:px-10">
        <div className="w-full flex items-center justify-center">
          <div className="w-full relative overflow-hidden h-40 md:h-[20rem]  lg:h-[30rem] rounded-lg bg-gray-400">
            {loading ? (
              <div className="flex items-center justify-center w-full h-full relative">
                {/* Skeleton Loader */}
                <div className="absolute inset-0 bg-gray-300 opacity-50 rounded-lg" />
                {/* Circular Spinner */}
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            ) : sliderData.length === 0 ? (
              <div className="text-center text-xl rounded-lg">
                No slider data available.
              </div>
            ) : (
              <div
                className="relative w-full h-40 md:w-full md:h-full"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="flex transition-transform duration-1000 h-full"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                  ref={sliderRef}
                >
                  {sliderData.map((slide) => (
                    <div
                      key={slide.id}
                      className="w-full flex-shrink-0 rounded-lg shadow-lg overflow-hidden h-full relative"
                    >
                      <img
                        src={slide.image}
                        alt={slide.property_title}
                        className="w-full h-full rounded-lg object-cover"
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
                {/* Navigation Arrows */}
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
                <div className="absolute md:bottom-4 bottom-2 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2 z-20">
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
