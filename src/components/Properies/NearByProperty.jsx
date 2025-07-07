import { MapPinIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchAllProperties } from "../../api/propertyApi";
import PageComponents from "../PageComponents";

const PropertySkeleton = () => (
  <div className="bg-white rounded-lg shadow-md relative min-w-[320px] max-w-xs flex-shrink-0 animate-pulse">
    <div className="relative">
      {/* Image skeleton */}
      <div className="w-full h-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />

      {/* Gradient overlay skeleton */}
      <div
        className="absolute bottom-0 left-0 w-full h-1/3 rounded-b-lg pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(55, 65, 81, 0.7) 60%, rgba(55, 65, 81, 0.0) 100%)",
          backdropFilter: "blur(1px)",
        }}
      />

      {/* Property type skeleton */}
      <div className="absolute top-2 left-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer text-sm px-4 py-1 rounded-lg z-10 w-20 h-6" />

      {/* Category skeleton */}
      <div className="absolute bottom-12 left-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer text-sm px-8 py-1 rounded-sm z-10 w-24 h-6" />

      {/* Title and price skeleton */}
      <div className="absolute bottom-6 left-2 right-2 flex justify-between">
        <div className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer h-4 w-32 rounded-sm" />
        <div className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer h-4 w-24 rounded-sm" />
      </div>

      {/* Address skeleton */}
      <div className="absolute bottom-0 left-2 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-[length:200%_100%] animate-shimmer text-sm px-12 rounded-sm z-10 w-40 h-4" />
    </div>
  </div>
);

// Create a simple cache object outside the component
const propertyCache = {
  data: null,
  lastFetch: null,
  location: null,
  // Cache for 5 minutes (300000 ms)
  CACHE_DURATION: 300000,
};

export default function NearByProperty() {
  const [Properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("userLocation") || "Phnom Penh"
  );
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMountedRef = useRef(true);

  // Check if we have valid cached data
  const isDataCached = () => {
    if (!propertyCache.data || !propertyCache.lastFetch) return false;

    const timeSinceLastFetch = Date.now() - propertyCache.lastFetch;
    const isCacheValid = timeSinceLastFetch < propertyCache.CACHE_DURATION;
    const isSameLocation = propertyCache.location === selectedLocation;

    return isCacheValid && isSameLocation;
  };

  // Filter properties based on location
  const filterPropertiesByLocation = (allProperties, location) => {
    return allProperties.filter((property) => {
      if (!property.address) return false;

      const propertyAddress = property.address.toLowerCase();
      const searchLocation = location.toLowerCase();

      // Try different variations of the location name
      const locationVariations = [
        searchLocation,
        searchLocation + " province",
        searchLocation + " city",
        searchLocation.replace(" ", ""),
      ];

      return locationVariations.some((variation) =>
        propertyAddress.includes(variation)
      );
    });
  };

  useEffect(() => {
    isMountedRef.current = true;

    const fetchProperties = async () => {
      try {
        // Check if we have cached data first
        if (isDataCached()) {
          console.log("Using cached data for location:", selectedLocation);
          const filteredProperties = filterPropertiesByLocation(
            propertyCache.data,
            selectedLocation
          );

          if (isMountedRef.current) {
            setProperties(filteredProperties);
            setLoading(false);
            setFadeIn(true);
          }
          return;
        }

        console.log("Fetching new data for location:", selectedLocation);
        setLoading(true);
        setFadeIn(false);

        // Fetch new data
        const result = await fetchAllProperties(1, 100);
        const allProperties = result.data || [];

        // Update cache
        propertyCache.data = allProperties;
        propertyCache.lastFetch = Date.now();
        propertyCache.location = selectedLocation;

        // Filter properties
        const filteredProperties = filterPropertiesByLocation(
          allProperties,
          selectedLocation
        );

        console.log("Selected Location:", selectedLocation);
        console.log("Total Properties:", allProperties.length);
        console.log("Filtered Properties:", filteredProperties.length);

        if (isMountedRef.current) {
          setProperties(filteredProperties);

          // Add a small delay before showing content for smoother transition
          setTimeout(() => {
            if (isMountedRef.current) {
              setLoading(false);
              setFadeIn(true);
            }
          }, 300);
        }
      } catch (error) {
        console.error("Error fetching Properties:", error);
        if (isMountedRef.current) {
          setLoading(false);
          setFadeIn(true);
        }
      }
    };

    fetchProperties();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, [selectedLocation]);

  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newLocation = localStorage.getItem("userLocation") || "Phnom Penh";
      if (newLocation !== selectedLocation) {
        setSelectedLocation(newLocation);
      }
    };

    // Check for changes periodically (alternative to storage event)
    const interval = setInterval(() => {
      const currentLocation =
        localStorage.getItem("userLocation") || "Phnom Penh";
      if (currentLocation !== selectedLocation) {
        setSelectedLocation(currentLocation);
      }
    }, 1000);

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [selectedLocation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-4 md:py-1 lg:px-10">
        <h2 className="text-xl md:text-xl mb-3 transition-all duration-500 ease-in-out transform">
          {t("nearby_properties.title", { location: selectedLocation })}
        </h2>
        <div className="flex overflow-x-auto gap-1 md:gap-4 rounded-lg hide-scrollbar scroll-smooth">
          {loading ? (
            // Show 4 skeleton cards while loading with staggered animation
            <div className="flex gap-1 md:gap-4">
              {Array(4)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="animate-fade-in-up"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <PropertySkeleton />
                  </div>
                ))}
            </div>
          ) : Properties.length === 0 ? (
            <div
              className={`text-gray-500 p-4 transition-all duration-500 ease-in-out ${
                fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              No Properties found in {selectedLocation}.
            </div>
          ) : (
            <div className="flex gap-1 md:gap-4">
              {Properties.slice(0, 12).map((property, index) => (
                <div
                  key={property.id}
                  className={`bg-white rounded-lg shadow-md relative min-w-[320px] max-w-xs flex-shrink-0 cursor-pointer transform transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up ${
                    fadeIn
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "both",
                  }}
                  onClick={() =>
                    navigate(`/property/${property.id}`, {
                      state: {
                        from: window.location.pathname,
                        property: property,
                      },
                    })
                  }
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={property.title_image || property.image}
                      alt="Property"
                      className="w-full h-56 object-cover rounded-lg transition-transform duration-500 ease-in-out hover:scale-110"
                      loading="lazy"
                    />
                    {/* Blur gray gradient overlay */}
                    <div
                      className="absolute bottom-0 left-0 w-full h-1/3 rounded-b-lg pointer-events-none transition-all duration-300 ease-in-out"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(55, 65, 81, 0.7) 60%, rgba(55, 65, 81, 0.0) 100%)",
                        backdropFilter: "blur(2px)",
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-gray-500 text-white text-sm px-2 py-1 rounded-lg z-10 transition-all duration-300 ease-in-out hover:bg-gray-600 backdrop-blur-sm">
                      {property.propery_type}
                    </div>
                    <div className="absolute bottom-12 flex items-center gap-2 left-2 text-white px-1 py-1 rounded-sm z-10 transition-all duration-300 ease-in-out">
                      <img
                        className="h-5 w-5 transition-transform duration-300 ease-in-out hover:scale-110"
                        src={property.category?.image}
                        alt={property.category?.category}
                        loading="lazy"
                      />
                      <span className="transition-all duration-300 ease-in-out">
                        {property.category?.category}
                      </span>
                    </div>
                    <div className="absolute bottom-6 flex items-center justify-between gap-2 left-2 right-2 text-white px-1 py-1 rounded-sm z-10 transition-all duration-300 ease-in-out">
                      <span className="text-left font-medium transition-all duration-300 ease-in-out">
                        {property.title}
                      </span>
                      <span className="text-right overflow-hidden whitespace-nowrap font-semibold transition-all duration-300 ease-in-out">
                        {typeof property.price === "number"
                          ? `$${property.price.toLocaleString()}`
                          : property.price}
                      </span>
                    </div>
                    <div className="absolute bottom-0 flex items-center justify-normal gap-2 left-2 text-white px-1 py-1 rounded-sm z-10 w-[calc(100%-16px)] transition-all duration-300 ease-in-out">
                      <MapPinIcon className="w-4 h-4 flex-shrink-0 transition-transform duration-300 ease-in-out hover:scale-110" />
                      <span
                        className="truncate max-w-[calc(100%-30px)] transition-all duration-300 ease-in-out"
                        title={property.address}
                      >
                        {property.address}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Enhanced custom CSS for smooth animations */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-shimmer {
            animation: shimmer 2s infinite linear;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }
          
          .scroll-smooth {
            scroll-behavior: smooth;
          }
          
          /* Smooth scrolling for the entire page */
          html {
            scroll-behavior: smooth;
          }
          
          /* Enhanced transitions for better performance */
          * {
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            -webkit-perspective: 1000;
            perspective: 1000;
          }
        `}
      </style>
    </PageComponents>
  );
}
