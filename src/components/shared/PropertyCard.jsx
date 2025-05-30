import { EyeIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import { toggleFavorite } from "../../api/propertyApi";
import { useStateContext } from "../../contexts/ContextProvider";

// Helper function to trim text
function trimText(text, maxLength = 30) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

// Simple toast function (reuse or define if not available)
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `fixed right-8 top-8 z-50 px-6 py-3 rounded shadow text-white text-center transition-all duration-300 opacity-0 translate-x-10 ${
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600"
  }`;
  document.body.appendChild(toast);
  // Trigger reflow and then animate in
  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-x-10");
    toast.classList.add("opacity-100", "translate-x-0");
  }, 10);
  setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-x-0");
    toast.classList.add("opacity-0", "translate-x-10");
    setTimeout(() => document.body.removeChild(toast), 400);
  }, 2000);
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24">
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
  );
}

// LocalStorage helpers for favorite property IDs
function getFavoriteIds() {
  try {
    return JSON.parse(localStorage.getItem("favoritePropertyIds") || "[]");
  } catch {
    return [];
  }
}

function setFavoriteIds(ids) {
  localStorage.setItem("favoritePropertyIds", JSON.stringify(ids));
}

const PropertyCard = ({ property, view = "grid", onFavoriteChange }) => {
  const isGridView = view === "grid";
  const [imgLoaded, setImgLoaded] = useState(false);
  const navigate = useNavigate();
  const { userToken } = useStateContext();
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const favIds = getFavoriteIds();
    setIsFav(favIds.includes(property.id));
  }, [property.id]);

  const handleCardClick = async () => {
    try {
      // Call the API to increment click count
      const response = await fetch(
        "http://127.0.0.1:8000/api/set_property_total_click_public",
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
        // Navigate to property detail page after successful click tracking
        navigate(`/property/${property.id}`);
      } else {
        console.error("Failed to track property click:", data.message);
        // Still navigate even if tracking fails
        navigate(`/property/${property.id}`);
      }
    } catch (error) {
      console.error("Error tracking property click:", error);
      // Navigate even if there's an error
      navigate(`/property/${property.id}`);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!userToken) {
      showToast("Please log in to use favorites.", "error");
      return;
    }
    if (favLoading) return;
    setFavLoading(true);
    const type = isFav ? 0 : 1;
    try {
      const res = await toggleFavorite(property.id, type, userToken);
      if (!res.error) {
        let favIds = getFavoriteIds();
        if (type === 1) {
          favIds = [...new Set([...favIds, property.id])];
          showToast("Added to favorites!", "success");
        } else {
          favIds = favIds.filter((id) => id !== property.id);
          showToast("Removed from favorites!", "success");
        }
        setFavoriteIds(favIds);
        setIsFav(type === 1);
        if (onFavoriteChange) onFavoriteChange(property.id, type === 1);
      }
    } catch {
      showToast("Failed to update favorite status.", "error");
    } finally {
      setFavLoading(false);
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
          {/* Image Skeleton using react-loading-skeleton */}
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
            className={`absolute bottom-1 md:bottom-2 left-1  md:left-2 bg-gray-500 text-white text-sm   px-1 md:px-2 py-0 rounded-md z-10`}
          >
            {property.status}
          </div>
          {isGridView && (
            <>
              <div className="absolute flex justify-between items-center gap-1  top-1 left-1 md:top-2 md:left-2 bg-gray-400 text-white text-sm px-2 py-1 md:py-1 rounded-full">
                <EyeIcon className="w-4 h-4 md:w-5 md:h-5  text-white" />
                <span className="text-sm md:text-md text-white">
                  {property.views}
                </span>
              </div>
              <button
                className="absolute flex justify-between items-center gap-1 top-0 right-0 md:top-2 md:right-2 text-sm px-2 py-1 rounded-full focus:outline-none"
                onClick={handleToggleFavorite}
                disabled={favLoading}
                title={isFav ? "Remove from favorites" : "Add to favorites"}
                style={{ background: "transparent" }}
              >
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full mx-auto flex items-center justify-center bg-white">
                  {favLoading ? (
                    <Spinner />
                  ) : isFav ? (
                    <HeartSolid className="w-4 h-4 md:w-7 md:h-7 text-red-500" />
                  ) : (
                    <HeartOutline className="w-4 h-4 md:w-7 md:h-7 text-gray-400" />
                  )}
                </div>
              </button>
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
                    src={property.category}
                    alt="category"
                  />
                  <span className=" text-sm md:text-md text-gray-500 ">
                    {property.type}
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
                  <span className=" text-sm md:text-md text-gray-500 ">
                    {property.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white rounded-sm">
                  <div className="flex justify-between items-center gap-2">
                    <EyeIcon className="w-4 h-4 md:w-5 md:h-5 mt-1 text-blue-800" />
                    <span className="text-sm md:text-md text-blue-900">
                      {property.views}
                    </span>
                  </div>
                  <button
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full mx-auto flex items-center justify-center focus:outline-none"
                    onClick={handleToggleFavorite}
                    disabled={favLoading}
                    title={isFav ? "Remove from favorites" : "Add to favorites"}
                    style={{ background: "#fff" }}
                  >
                    {favLoading ? (
                      <Spinner />
                    ) : isFav ? (
                      <HeartSolid className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
                    ) : (
                      <HeartOutline className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                    )}
                  </button>
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

              <div className="flex  items-center gap-1">
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

export default PropertyCard;
