import { MapPinIcon } from "@heroicons/react/20/solid";
import { BsHouse } from "react-icons/bs";
import PageComponents from "../PageComponents";

const properties = Array.from({ length: 9 }).map((_, i) => ({
  id: i,
  image:
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?cs=srgb&dl=pexels-binyaminmellish-106399.jpg&fm=jpg",
  type: "Residential",
  title: "Villa For Sale",
  price: "$1,000,000",
  status: "Sale",
  location: "Phnom Penh",
}));

export default function NearByProperty() {
  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-1 md:px-10">
        <h2 className="text-xl md:text-xl  mb-3">
          Nearby Properties (Phnom Penh)
        </h2>
        <div className="flex overflow-x-auto gap-1 md:gap-4 rounded-lg  hide-scrollbar">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md relative min-w-[320px] max-w-xs flex-shrink-0"
            >
              <div className="relative">
                <img
                  src={property.image}
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
                  {property.status}
                </div>
                <div className="absolute bottom-12 flex items-center gap-2 left-2 text-white px-1 py-1 rounded-sm z-10">
                  <BsHouse className="w-4 h-4" />
                  <span>{property.type}</span>
                </div>
                <div className="absolute bottom-6 flex items-center justify-between gap-2 left-2 text-white px-1 py-1 rounded-sm z-10">
                  <span>{property.title}</span>
                  <span>{property.price}</span>
                </div>
                <div className="absolute bottom-0 flex items-center justify-between gap-2 left-2 text-white px-1 py-1 rounded-sm z-10">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>
              </div>
            </div>
          ))}
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
