import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add useNavigate
import { fetchRecentlyAdded } from "../../api/propertyApi";
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

export default function RecentlyAdded() {
  const navigate = useNavigate();
  const [view, setView] = useState("grid");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFromCache, setIsFromCache] = useState(false); // Track if loaded from cache

  // Load data from cache or fetch fresh data
  useEffect(() => {
    const cache = sessionStorage.getItem("recentlyAddedCache");
    if (cache) {
      const { properties, view } = JSON.parse(cache);
      setProperties(properties);
      setView(view);
      setIsFromCache(true);
      setLoading(false);
      sessionStorage.removeItem("recentlyAddedCache");
    } else {
      fetchData();
    }
  }, []);

  // Restore scroll position after loading
  useEffect(() => {
    if (!loading) {
      const scroll = sessionStorage.getItem("recentlyAddedScroll");
      if (scroll) {
        window.scrollTo(0, parseInt(scroll, 10));
        sessionStorage.removeItem("recentlyAddedScroll");
      }
    }
  }, [loading]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchRecentlyAdded(12);
      const mappedProperties = data
        .filter((property) => property.status === 1)
        .map((property) => ({
          id: property.id,
          image: property.title_image,
          status: property.propery_type,
          type: property.category.category,
          category: property.category.image,
          price: `$${property.price.toLocaleString()}`,
          title: property.title,
          location: property.address,
          views: property.total_view,
          time: property.post_created,
        }));
      setProperties(mappedProperties);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handlePropertyClick = (propertyId) => {
    // Save state to cache before navigating
    sessionStorage.setItem("recentlyAddedScroll", window.scrollY);
    sessionStorage.setItem(
      "recentlyAddedCache",
      JSON.stringify({
        properties,
        view,
      })
    );
    navigate(`/property/${propertyId}`);
  };

  if (loading) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-4 md:py-5 lg:px-10">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md md:text-xl">Recently Added</h2>
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
      <div className="w-full max-w-6xl mx-auto py-4 md:py-5 lg:px-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md md:text-2xl">Recently Added</h2>
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
              <div onClick={() => handlePropertyClick(property.id)}>
                <PropertyCard property={property} view={view} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageComponents>
  );
}
