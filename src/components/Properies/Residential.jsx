import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllProperties } from "../../api/propertyApi";
import PageComponents from "../PageComponents";
import PropertyCard from "../shared/PropertyCard";
import PropertyCardSkeleton from "../shared/PropertyCardSkeleton";
import PropertyFilters from "./PropertyFilters";

const cardVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      type: "spring",
      ease: "easeOut",
      damping: 12,
    },
  }),
};

export default function Residential() {
  const navigate = useNavigate();
  const [view, setView] = useState("grid");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const cacheRestoreRef = useRef(null);
  const didMountRef = useRef(false);
  const propertiesPerPage = 24;
  const [currentFilters, setCurrentFilters] = useState({});

  // Load data from cache or fetch fresh data on mount
  useEffect(() => {
    const cache = sessionStorage.getItem("propertiesCache");
    if (cache) {
      const { view, currentPage, totalProperties, filters } = JSON.parse(cache);
      setView(view);
      setCurrentPage(currentPage);
      setTotalProperties(totalProperties);
      setCurrentFilters(filters || {});
      cacheRestoreRef.current = { page: currentPage, filters: filters || {} };
      sessionStorage.removeItem("propertiesCache");
    } else {
      fetchData(); // Initial load without filters
    }
    didMountRef.current = true;
  }, []);

  // Restore scroll position after loading
  useEffect(() => {
    if (!loading) {
      const scroll = sessionStorage.getItem("propertiesScroll");
      if (scroll) {
        window.scrollTo(0, parseInt(scroll, 10));
        sessionStorage.removeItem("propertiesScroll");
      }
    }
  }, [loading]);

  // Fetch data for restored cache after state is set
  useEffect(() => {
    if (cacheRestoreRef.current) {
      fetchData(cacheRestoreRef.current.filters, cacheRestoreRef.current.page);
      cacheRestoreRef.current = null;
    }
  }, [currentPage, currentFilters]);

  // Fetch data when user changes page (not on mount)
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Only fetch if not on initial mount (prevents double fetch)
      if (didMountRef.current) {
        fetchData(currentFilters, page);
      }
    }
  };

  // Fetch data when user applies filters
  const handleFilterApply = (filters) => {
    setCurrentPage(1);
    setCurrentFilters(filters);
    fetchData(filters, 1);
  };

  // Fetch data when user clears filters
  const handleFilterClear = () => {
    setCurrentPage(1);
    setCurrentFilters({});
    fetchData({}, 1);
  };

  // Fetch data when page changes or on filter button click
  const fetchData = async (filters = currentFilters, page = currentPage) => {
    setLoading(true);
    try {
      // Remove null/undefined values from filters
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value != null)
      );

      const { data = [], total } = await fetchAllProperties(
        page,
        propertiesPerPage,
        { ...cleanFilters, category: "Residential" }
      );

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format from server");
      }

      const mappedProperties = data
        .filter(
          (property) =>
            property.status === 1 &&
            property.category?.category === "Residential"
        )
        .map((property) => ({
          id: property.id,
          image: property.title_image,
          status: property.propery_type,
          type: property.category?.category,
          category: property.category?.image,
          price: `$${property.price.toLocaleString()}`,
          title: property.title,
          location: property.address,
          views: property.total_view,
          time: property.post_created,
        }));

      setProperties(mappedProperties);
      setTotalProperties(total);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch properties. Please try again.");
      setProperties([]);
      setTotalProperties(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (propertyId) => {
    // Save current state to cache before navigating
    sessionStorage.setItem("propertiesScroll", window.scrollY);
    sessionStorage.setItem(
      "propertiesCache",
      JSON.stringify({
        view,
        currentPage,
        totalProperties,
        filters: currentFilters,
      })
    );
    navigate(`/property/${propertyId}`);
  };

  const totalPages = Math.ceil(totalProperties / propertiesPerPage);

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = window.innerWidth < 768 ? 3 : 5; // Show fewer pages on mobile
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-1 sm:gap-2 mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-800 text-white hover:bg-blue-900"
          }`}
        >
          Previous
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md bg-gray-200 hover:bg-gray-300"
            >
              1
            </button>
            {startPage > 2 && <span className="px-1">...</span>}
          </>
        )}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md ${
              currentPage === page
                ? "bg-blue-800 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-1">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md bg-gray-200 hover:bg-gray-300"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-800 text-white hover:bg-blue-900"
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-4 md:py-5 lg:px-10">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md md:text-xl">All Properties</h2>
            <div className="flex items-center gap-2">
              <PropertyFilters
                onFilter={handleFilterApply}
                onClear={handleFilterClear}
              />
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
            {Array.from({ length: propertiesPerPage }).map((_, i) => (
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
        <PropertyFilters
          onFilter={handleFilterApply}
          onClear={handleFilterClear}
        />
        <div className="w-full max-w-6xl mx-auto py-4 md:py-5 md:px-10">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </PageComponents>
    );
  }

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-5 lg:px-10">
        <div className="relative w-full h-[15vh] md:h-[40vh] mb-6">
          <img
            src="https://saltosystems.com/sites/default/files/styles/breakpoint_1920/public/images/contents/residential_background_1.jpg?itok=yErIXYOm"
            alt="Residential"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">
              Residential
            </h1>
          </div>
        </div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md md:text-2xl">All Properties</h2>
          <div className="flex items-center gap-2">
            <PropertyFilters
              onFilter={handleFilterApply}
              onClear={handleFilterClear}
            />
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
        {totalPages > 1 && renderPagination()}
      </div>
    </PageComponents>
  );
}
