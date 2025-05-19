import { MapPinIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { BsHouse } from "react-icons/bs";
import PageComponents from "../PageComponents";

export default function NearByProperty() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8001/api/get_property_public")
      .then((res) => res.json())
      .then((result) => {
        // Filter by address
        const phnomPenhProps = (result.data || []).filter(
          (property) => property.address === "Phnom Penh"
        );
        setProperties(phnomPenhProps);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-1 md:px-10">
        <h2 className="text-xl md:text-xl  mb-3">
          Nearby Properties (Phnom Penh)
        </h2>
        <div className="flex overflow-x-auto gap-1 md:gap-4 rounded-lg  hide-scrollbar">
          {loading ? (
            <div className="text-gray-500 p-4">Loading...</div>
          ) : properties.length === 0 ? (
            <div className="text-gray-500 p-4">
              No properties found in Phnom Penh.
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
                    <span>{property.title}</span>
                    <span>
                      {typeof property.price === "number"
                        ? `$${property.price.toLocaleString()}`
                        : property.price}
                    </span>
                  </div>
                  <div className="absolute bottom-0 flex items-center justify-between gap-2 left-2 text-white px-1 py-1 rounded-sm z-10">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{property.address}</span>
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
