import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import PageComponents from "../PageComponents";
import PropertyCard from "../shared/PropertyCard";
import PropertyCardSkeleton from "../shared/PropertyCardSkeleton";

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  }),
};

export default function MostViewProperty() {
  const [view, setView] = useState("grid");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "http://localhost:8001/api/get_property_public?limit=12&top_rated=1"
        );
        const result = await response.json();

        if (result.error || !result.data) {
          throw new Error(result.message || "No data received");
        }

        // Map API data to PropertyCard expected fields and filter by status: 1
        const mappedProperties = result.data
          .filter((property) => property?.status === 1)
          .map((property) => ({
            id: property?.id || 0,
            image:
              property?.title_image || "https://via.placeholder.com/300x200",
            status: property?.propery_type || "N/A",
            type: property?.category?.category || "Unknown",
            category: property.category.image,
            price: property?.price
              ? `$${property.price.toLocaleString()}`
              : "$0",
            title: property?.title || "Untitled",
            location: property?.address || "Unknown Location",
            views: property?.total_view || 0, // Map total_click (API field for views)
            time: property?.post_created || "N/A",
          }));

        // Sort by views (most viewed first) as a fallback
        mappedProperties.sort((a, b) => b.views - a.views);

        // Debug log to verify sorting
        console.log("Sorted properties by views:", mappedProperties);

        setProperties(mappedProperties);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-4 md:py-5 md:px-10">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md md:text-xl">Most view property</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-md ${
                  view === "grid" ? "bg-blue-800 text-white" : "bg-gray-200"
                }`}
              >
                <Squares2X2Icon className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md ${
                  view === "list" ? "bg-blue-800 text-white" : "bg-gray-200"
                }`}
              >
                <ListBulletIcon className="w-4 h-4 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
          <div
            className={`grid ${
              view === "grid"
                ? "grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 lg:grid-cols-2"
            } gap-4`}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} view={view} />
            ))}
          </div>
        </div>
      </PageComponents>
    );
  }

  if (error) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-4 md:py-5 md:px-10">
          <p>Error: {error}</p>
        </div>
      </PageComponents>
    );
  }

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-5 md:px-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md md:text-2xl">Most View Property</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-md ${
                view === "grid" ? "bg-blue-800 text-white" : "bg-gray-200"
              }`}
            >
              <Squares2X2Icon className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-md ${
                view === "list" ? "bg-blue-800 text-white" : "bg-gray-200"
              }`}
            >
              <ListBulletIcon className="w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
        <div
          className={`grid ${
            view === "grid"
              ? "grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 lg:grid-cols-2"
          } gap-4`}
        >
          {properties.map((property, i) => (
            <motion.div
              key={property.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <PropertyCard property={property} view={view} />
            </motion.div>
          ))}
        </div>
      </div>
    </PageComponents>
  );
}
