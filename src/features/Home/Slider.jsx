import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { fetchSlider } from "../../api/sliderApi";

// ✅ Skeleton Slider Component
const SkeletonSlider = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg aspect-[16/9] md:aspect-[22/9]">
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

const Slider = ({ isMenuAtTop = true }) => {
  const [sliderData, setSliderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  // const sliderRef = useRef(null);

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

  /*
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
  */

  return (
    <div
      className={`w-full max-w-8xl mx-auto px-1 py-0 md:py-0 lg:px-0 ${
        !isMenuAtTop ? "mt-16" : ""
      }`}
    >
      <div className="w-full flex items-center justify-center">
        <div className="w-full relative overflow-hidden">
          {loading ? (
            <SkeletonSlider />
          ) : error ? (
            <div className="flex items-center justify-center w-full aspect-[22/9]​  text-red-500 text-center px-4">
              {error}
            </div>
          ) : sliderData.length === 0 ? (
            <div className="text-center text-xl aspect-[16/9] flex items-center justify-center">
              No slider data available.
            </div>
          ) : (
            <div className="relative w-full h-full aspect-[21/9] md:aspect-[22/9]">
              {/*
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
                    className="w-full flex-shrink-0  overflow-hidden relative"
                  >
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent  animate-spin"></div>
                      </div>
                    )}
                    <img
                      src={slide.image}
                      alt={slide.property_title}
                      className="w-full h-full object-cover border "
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                    {slide.link && (
                      <button
                        onClick={(e) => handleLinkClick(e, slide.link)}
                        className="absolute top-2 right-2 md:top-4 md:right-4 rounded-lg bg-white px-2 py-1 text-sm md:text-base md:px-4 md:py-2  shadow-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Contact Us
                      </button>
                    )}
                  </div>
                ))}
              </div>
              */}
              {sliderData.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                    idx === currentIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0 pointer-events-none"
                  }`}
                  style={{
                    transitionProperty: "opacity",
                  }}
                >
                  {imageLoading && idx === currentIndex && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent animate-spin"></div>
                    </div>
                  )}
                  <img
                    src={slide.image}
                    alt={slide.property_title}
                    className="w-full h-full object-contain border"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{
                      visibility: idx === currentIndex ? "visible" : "hidden",
                    }}
                  />
                  {slide.link && idx === currentIndex && (
                    <button
                      onClick={(e) => handleLinkClick(e, slide.link)}
                      className="absolute top-2 right-2 md:top-4 md:right-4 rounded-lg bg-white px-2 py-1 text-sm md:text-base md:px-4 md:py-2  shadow-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Contact Us
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Slider;
