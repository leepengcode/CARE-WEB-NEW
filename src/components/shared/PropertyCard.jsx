import { EyeIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Helper function to trim text
function trimText(text, maxLength = 30) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

const PropertyCard = ({ property, view = "grid" }) => {
  const isGridView = view === "grid";
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className={`bg-gray-100 rounded-lg shadow-md overflow-hidden ${
        isGridView ? "flex flex-col" : "flex h-28 md:h-36"
      }`}
    >
      <div className={`relative ${isGridView ? "w-full" : "w-[40%]"}`}>
        {/* Image Skeleton using react-loading-skeleton */}
        {!imgLoaded && (
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
        )}
        <img
          src={property.image}
          alt="Property"
          className={`w-full h-32 md:h-48 object-cover rounded-lg ${
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
            <div className="absolute flex justify-between items-center gap-1 top-0 right-0 md:top-2 md:right-2 text-sm px-2 py-1 rounded-full">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-400 rounded-full mx-auto flex items-center justify-center">
                <HeartIcon className="w-4 h-4 md:w-5 md:h-5 text-white" />
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
                  src={property.category}
                  alt="category"
                />
                <span className=" text-sm md:text-md text-gray-500 ">
                  {property.type}
                </span>
              </div>
            </div>
            <h1 className="text-sm md:text-lg font-semibold text-blue-900">
              {trimText(property.title, 20)}
            </h1>
            <div className="flex justify-between items-center py-1">
              <h1 className="text-sm md:text-lg font-semibold">
                {property.price}
              </h1>
            </div>

            <div className="flex md:py-1 items-center gap-1">
              <MapPinIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              <span className="text-sm md:text-md text-gray-500">
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
                  <span className="text-sm md:text-md text-gray-500">
                    {property.views}
                  </span>
                </div>
                <div className=" w-6 h-6 md:w-8 md:h-8 bg-white rounded-full mx-auto flex items-center justify-center">
                  <HeartIcon className=" w-5 h-5 md:w-6 md:h-6 text-blue-800" />
                </div>
              </div>
            </div>
            <h1 className="text-sm md:text-lg font-semibold text-blue-900">
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
              <span className="text-sm md:text-md text-gray-500">
                {trimText(property.location, 30)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
