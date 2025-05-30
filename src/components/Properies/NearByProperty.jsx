import { MapPinIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { BsHouse } from "react-icons/bs";
import { fetchAllProperties } from "../../api/propertyApi";
import PageComponents from "../PageComponents";

const PropertySkeleton = () => (
  <div className="bg-white rounded-lg shadow-md relative min-w-[320px] max-w-xs flex-shrink-0">
    <div className="relative">
      {/* Image skeleton */}
      <div className="w-full h-56 bg-gray-200 animate-pulse rounded-lg" />

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
      <div className="absolute top-2 left-2 bg-gray-300 animate-pulse text-sm px-4 py-1 rounded-lg z-10" />

      {/* Category skeleton */}
      <div className="absolute bottom-12 left-2 bg-gray-300 animate-pulse text-sm px-8 py-1 rounded-sm z-10" />

      {/* Title and price skeleton */}
      <div className="absolute bottom-6 left-2 right-2 flex justify-between">
        <div className="bg-gray-300 animate-pulse h-4 w-32 rounded-sm" />
        <div className="bg-gray-300 animate-pulse h-4 w-24 rounded-sm" />
      </div>

      {/* Address skeleton */}
      <div className="absolute bottom-0 left-2 bg-gray-300 animate-pulse text-sm px-12  rounded-sm z-10" />
    </div>
  </div>
);

export default function NearByProperty() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("userLocation") || "Phnom Penh"
  );

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Fetch more properties (increased limit to 100)
        const result = await fetchAllProperties(1, 100);
        const allProperties = result.data || [];

        // Debug logging
        console.log("Selected Location:", selectedLocation);
        console.log("Total Properties:", allProperties.length);
        console.log(
          "All Properties Addresses:",
          allProperties.map((p) => p.address)
        );

        // Filter properties based on selected location
        const filteredProperties = allProperties.filter((property) => {
          if (!property.address) return false;

          const propertyAddress = property.address.toLowerCase();
          const searchLocation = selectedLocation.toLowerCase();

          // Try different variations of the location name
          const locationVariations = [
            searchLocation,
            searchLocation + " province",
            searchLocation + " city",
            searchLocation.replace(" ", ""),
            "sihanoukville", // Common alternative name
            "preah sihanouk",
          ];

          const matches = locationVariations.some((variation) =>
            propertyAddress.includes(variation)
          );

          if (matches) {
            console.log("Matched property:", {
              address: property.address,
              location: selectedLocation,
            });
          }

          return matches;
        });

        console.log("Filtered Properties:", filteredProperties);
        setProperties(filteredProperties);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [selectedLocation]); // Re-fetch when location changes

  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newLocation = localStorage.getItem("userLocation") || "Phnom Penh";
      setSelectedLocation(newLocation);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-1 lg:px-10">
        <h2 className="text-xl md:text-xl mb-3">
          Nearby Properties ({selectedLocation})
        </h2>
        <div className="flex overflow-x-auto gap-1 md:gap-4 rounded-lg hide-scrollbar">
          {loading ? (
            // Show 4 skeleton cards while loading
            Array(4)
              .fill(null)
              .map((_, index) => <PropertySkeleton key={index} />)
          ) : properties.length === 0 ? (
            <div className="text-gray-500 p-4">
              No properties found in {selectedLocation}.
            </div>
          ) : (
            properties.slice(0, 12).map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-md relative min-w-[320px] max-w-xs flex-shrink-0"
              >
                <div className="relative">
                  <img
                    src={property.title_image || property.image}
                    alt="Property"
                    className="w-full h-56 object-cover rounded-lg"
                  />
                  {/* Blur gray gradient overlay */}
                  <div
                    className="absolute bottom-0 left-0 w-full h-1/3 rounded-b-lg pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(55, 65, 81, 0.7) 60%, rgba(55, 65, 81, 0.0) 100%)",
                      backdropFilter: "blur(2px)",
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-gray-500 text-white text-sm px-1 py-1 rounded-lg z-10">
                    {property.propery_type}
                  </div>
                  <div className="absolute bottom-12 flex items-center gap-2 left-2 text-white px-1 py-1 rounded-sm z-10">
                    <BsHouse className="w-4 h-4" />
                    <span>{property.category?.category}</span>
                  </div>
                  <div className="absolute bottom-6 flex items-center justify-between gap-2 left-2 text-white px-1 py-1 rounded-sm z-10">
                    <span className="text-left ">{property.title}</span>
                    <span className="text-right overflow-hidden whitespace-nowrap">
                      {typeof property.price === "number"
                        ? `$${property.price.toLocaleString()}`
                        : property.price}
                    </span>
                  </div>
                  <div className="absolute bottom-0 flex items-center justify-normal gap-2 left-2 text-white px-1 py-1 rounded-sm z-10 w-[calc(100%-16px)] ">
                    <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                    <span
                      className="truncate max-w-[calc(100%-30px)]"
                      title={property.address}
                    >
                      {property.address}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Optional: Hide scrollbar with custom CSS */}
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
    </PageComponents>
  );
}
