import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdApartment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchAllProperties } from "../../api/propertyApi";
import PageComponents from "../../components/PageComponents";
import PropertyCard from "../../components/shared/PropertyCard";
import PropertyCardSkeleton from "../../components/shared/PropertyCardSkeleton";
import PropertyFilters from "./PropertyFilters";

export default function Properties() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [view, setView] = useState("grid");
  const [Properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [currentFilters, setCurrentFilters] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  const propertiesPerPage = 54;

  // Smooth scroll utility function
  const smoothScrollToTop = () => {
    // First try the native smooth scrolling
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Fallback for older browsers
      const startPosition = window.pageYOffset;
      const targetPosition = 0;
      const distance = targetPosition - startPosition;
      const duration = 600; // Reduced duration for better performance
      let start = null;

      const animation = (currentTime) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        // Simpler easing function
        const ease = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(0, startPosition + distance * ease);

        if (progress < 1) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  // Fetch data function
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
        cleanFilters
      );

      // Use the full property object as returned from the API, filter for status === 1
      const filteredProperties = data.filter(
        (property) => property.status === 1
      );
      setProperties(filteredProperties);
      setTotalProperties(total);
      setError(null);

      // Cache the data after successful fetch
      sessionStorage.setItem(
        "propertiesData",
        JSON.stringify({
          properties: filteredProperties,
          totalProperties: total,
          view,
          currentPage: page,
          filters: filters,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      setError(err.message || t("errors.failed_to_fetch_properties"));
      setProperties([]);
      setTotalProperties(0);
    } finally {
      setLoading(false);
    }
  };

  // Initialize component - load from cache or fetch fresh data
  useEffect(() => {
    const initializeComponent = async () => {
      const cachedData = sessionStorage.getItem("propertiesData");
      const cacheTimeout = 5 * 60 * 1000; // 5 minutes cache timeout

      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const isExpired = Date.now() - parsed.timestamp > cacheTimeout;

        if (!isExpired) {
          // Use cached data
          setProperties(parsed.properties);
          setTotalProperties(parsed.totalProperties);
          setView(parsed.view);
          setCurrentPage(parsed.currentPage);
          setCurrentFilters(parsed.filters || {});
          setLoading(false);
          setIsInitialized(true);

          // Restore scroll position
          const scrollPosition = sessionStorage.getItem("propertiesScroll");
          if (scrollPosition) {
            setTimeout(() => {
              window.scrollTo(0, parseInt(scrollPosition, 10));
              sessionStorage.removeItem("propertiesScroll");
            }, 100);
          }
          return;
        }
      }

      // No cache or expired cache - fetch fresh data
      await fetchData({}, 1);
      setIsInitialized(true);
    };

    initializeComponent();
  }, []); // Only run once on mount

  // Handle page changes
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      // Add a small delay to ensure state is updated before scrolling
      setTimeout(() => {
        smoothScrollToTop();
      }, 50);
      fetchData(currentFilters, page);
    }
  };

  // Handle filter apply
  const handleFilterApply = (filters) => {
    setCurrentPage(1);
    setCurrentFilters(filters);
    // Add a small delay to ensure state is updated before scrolling
    setTimeout(() => {
      smoothScrollToTop();
    }, 50);
    fetchData(filters, 1);
  };

  // Handle filter clear
  const handleFilterClear = () => {
    setCurrentPage(1);
    setCurrentFilters({});
    // Add a small delay to ensure state is updated before scrolling
    setTimeout(() => {
      smoothScrollToTop();
    }, 50);
    fetchData({}, 1);
  };

  const handlePropertyClick = (property) => {
    // Save current state to cache before navigating
    sessionStorage.setItem("propertiesScroll", window.scrollY.toString());
    navigate(`/property/${property.id}`, {
      state: {
        from: window.location.pathname,
        property: property,
      },
    });
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
          className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md transition-colors duration-200 ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-800 text-white hover:bg-blue-900"
          }`}
        >
          {t("properties_page.pagination_prev")}
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
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
            className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md transition-colors duration-200 ${
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
              className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md transition-colors duration-200 ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-800 text-white hover:bg-blue-900"
          }`}
        >
          {t("properties_page.pagination_next")}
        </button>
      </div>
    );
  };

  if (error) {
    // Don't render anything, useEffect will navigate back
    return null;
  }
  if (loading) {
    return (
      <PageComponents>
        <div className="w-full max-w-7xl mx-auto py-4 md:py-1 lg:px-18">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md md:text-2xl">
              {t("properties_page.title")}
            </h2>
            <div className="flex items-center gap-2">
              <PropertyFilters
                onFilter={handleFilterApply}
                onClear={handleFilterClear}
              />
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  view === "grid" ? "bg-blue-800 text-white" : "bg-gray-200"
                }`}
              >
                <Squares2X2Icon className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md transition-colors duration-200 ${
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
            {Array.from({ length: 54 }).map((_, i) => (
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
          <p className="text-red-600">
            {t("properties_page.error_message", { error: error })}
          </p>
        </div>
      </PageComponents>
    );
  }

  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-4 md:py-1 lg:px-18">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md md:text-2xl">{t("properties_page.title")}</h2>
          <div className="flex items-center gap-2">
            <PropertyFilters
              onFilter={handleFilterApply}
              onClear={handleFilterClear}
            />
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-md transition-colors duration-200 ${
                view === "grid" ? "bg-blue-800 text-white" : "bg-gray-200"
              }`}
            >
              <Squares2X2Icon className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-md transition-colors duration-200 ${
                view === "list" ? "bg-blue-800 text-white" : "bg-gray-200"
              }`}
            >
              <ListBulletIcon className="w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
        {Properties.length === 0 && !loading && !error ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <MdApartment className="w-16 h-16 mb-4" />
            <p className="text-lg">{t("properties_page.no_properties")}</p>
          </div>
        ) : (
          <div
            className={`grid ${
              view === "grid"
                ? "grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 lg:grid-cols-2"
            } gap-4`}
          >
            {Properties.map((property) => (
              <div
                key={property.id}
                onClick={() => handlePropertyClick(property)}
                className="cursor-pointer transition-transform duration-200 "
              >
                <PropertyCard property={property} view={view} />
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && Properties.length > 0 && renderPagination()}
      </div>
    </PageComponents>
  );
}
