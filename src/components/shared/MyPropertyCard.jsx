import { EyeIcon, MapPinIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

// Helper function to trim text
function trimText(text, maxLength = 30) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

const MyPropertyCard = ({ property, view = "grid" }) => {
  const isGridView = view === "grid";
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = async () => {
    try {
      const response = await fetch(
        "https://externalchecking.com/api/api_rone_new/public/api/set_property_total_click_public",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            property_id: property.id,
          }),
        }
      );

      const data = await response.json();
      if (!data.error) {
        navigate(`/property/${property.id}`, {
          state: { from: window.location.pathname, property: property },
        });
      } else {
        console.error("Failed to track property click:", data.message);
        navigate(`/property/${property.id}`, {
          state: { from: window.location.pathname, property: property },
        });
      }
    } catch (error) {
      console.error("Error tracking property click:", error);
      navigate(`/property/${property.id}`, {
        state: { from: window.location.pathname, property: property },
      });
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group bg-gray-100 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200 ${
          isGridView ? "flex flex-col" : "flex h-28 md:h-36"
        }`}
      >
        <div className={`relative ${isGridView ? "w-full" : "w-[40%]"}`}>
          {!imgLoaded && (
            <>
              <Skeleton
                className="absolute inset-0 z-0 rounded-lg"
                height={isGridView ? "100%" : "100%"}
                width="100%"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <svg
                  className="animate-spin h-8 w-8 text-blue-500"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              </div>
            </>
          )}
          <img
            src={property.image}
            alt="Property"
            className={`w-full h-32 md:h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105 hover:scale-105 ${
              !imgLoaded ? "invisible" : ""
            }`}
            onLoad={() => setImgLoaded(true)}
          />

          <div
            className={`absolute bottom-1 md:bottom-2 left-1 md:left-2 bg-gray-500 text-white text-sm px-1 md:px-2 py-0 rounded-md z-10`}
          >
            {property.status}
          </div>
          {isGridView && (
            <>
              <div className="absolute flex justify-between items-center gap-1 top-1 left-1 md:top-2 md:left-2 bg-gray-400 text-white text-sm px-2 py-1 md:py-1 rounded-full">
                <EyeIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                <span className="text-sm md:text-md text-white">
                  {property.views}
                </span>
              </div>
              <div className="absolute top-0 right-0 md:top-2 md:right-2">
                <div
                  className={`px-2 py-1 rounded-full text-xs md:text-sm font-medium ${
                    property.state === "1"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {property.state === "1" ? "Approved" : "Pending"}
                </div>
              </div>
            </>
          )}
        </div>
        <div
          className={`w-full ${
            isGridView ? "py-1 md:py-2 px-2 md:px-3" : "w-[70%] py-2 px-3"
          }`}
        >
          {isGridView ? (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-white rounded-sm">
                  <img
                    className="h-4 w-4 md:h-5 md:w-5"
                    src={property.category_image}
                    alt="category"
                  />
                  <span className="text-sm md:text-md text-gray-500">
                    {property?.category}
                  </span>
                </div>
              </div>
              <h1 className="text-sm md:text-lg mt-2 font-semibold text-blue-900 font-khmer">
                {trimText(property.title, 20)}
              </h1>
              <div className="flex justify-between items-center py-1">
                <h1 className="text-sm md:text-lg font-semibold">
                  {property.price}
                </h1>
              </div>

              <div className="flex md:py-1 items-center gap-1">
                <MapPinIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <span className="text-sm md:text-md text-gray-500 font-khmer">
                  {trimText(property.location, 14)}
                </span>
              </div>
              <span className="text-sm md:text-md text-black">
                {property.time}
              </span>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-white rounded-sm">
                  <img
                    className="h-4 w-4 md:h-5 md:w-5"
                    src={property.category}
                    alt="category"
                  />
                  <span className="text-sm md:text-md text-gray-500">
                    {property.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex justify-between items-center gap-2">
                    <EyeIcon className="w-4 h-4 md:w-5 md:h-5 mt-1 text-blue-800" />
                    <span className="text-sm md:text-md text-blue-900">
                      {property.views}
                    </span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs md:text-sm font-medium ${
                      property.state === "1"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {property.state === "1" ? "Approved" : "Pending"}
                  </div>
                </div>
              </div>
              <h1 className="text-sm md:text-lg mt-1 font-semibold text-blue-900 font-khmer">
                {trimText(property.title, 30)}
              </h1>
              <div className="flex justify-between items-center py-1">
                <h1 className="text-md md:text-lg font-semibold">
                  {property.price}
                </h1>
                <span className="text-sm md:text-md text-black">
                  {property.time}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
                <span className="text-sm md:text-md text-gray-500 font-khmer">
                  {trimText(property.location, 30)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`
        .font-khmer {
          font-family: 'Noto Sans Khmer', Hanuman, Battambang, Siemreap, sans-serif;
        }
      `}</style>
    </>
  );
};

export default MyPropertyCard;
