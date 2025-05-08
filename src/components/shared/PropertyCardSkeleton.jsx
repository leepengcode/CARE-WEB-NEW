import React from "react";

const PropertyCardSkeleton = ({ view = "grid" }) => {
  const isGridView = view === "grid";

  return (
    <div
      className={`bg-gray-100 rounded-lg shadow-md overflow-hidden animate-pulse ${
        isGridView ? "flex flex-col" : "flex h-28 md:h-36"
      }`}
    >
      <div className={`relative ${isGridView ? "w-full" : "w-[40%]"}`}>
        <div
          className={`w-full h-32 md:h-48 bg-gray-200 ${
            isGridView ? "rounded-lg" : "rounded-lg"
          }`}
        />
        <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 bg-gray-400 h-5 w-16 rounded-md z-10" />
        {isGridView && (
          <>
            <div className="absolute flex items-center gap-1 top-2 left-2 bg-gray-200 h-6 w-16 rounded-full" />
            <div className="absolute flex items-center gap-1 top-1 right-1 md:top-2 md:right-2 bg-gray-200 h-7 w-7 md:h-8 md:w-8 rounded-full" />
          </>
        )}
      </div>
      <div
        className={`w-full ${
          isGridView ? "py-1 md:py-2 px-2 md:px-3" : "w-[70%] py-2 px-3"
        }`}
      >
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
        <div className="flex justify-between items-center py-1">
          <div className="h-5 w-20 bg-gray-200 rounded" />
          {isGridView ? null : <div className="h-4 w-16 bg-gray-200 rounded" />}
        </div>
        <div className="flex items-center gap-1 mb-1">
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
        {isGridView && <div className="h-4 w-16 bg-gray-200 rounded" />}
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
