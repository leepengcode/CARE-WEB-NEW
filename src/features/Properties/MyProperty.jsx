import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdApartment } from "react-icons/md";
import PageComponents from "../../components/PageComponents";
import MyPropertyFilter from "../../components/Properies/MyPropertyFilter";
import MyPropertyCard from "../../components/shared/MyPropertyCard";
import PropertyCardSkeleton from "../../components/shared/PropertyCardSkeleton";
import { useStateContext } from "../../contexts/ContextProvider";

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized API fetch function
const fetchMyProperties = async ({
  userToken,
  role,
  userid,
  status,
  offset = 0,
  limit = 100,
}) => {
  const url =
    "https://externalchecking.com/api/api_rone_new/public/api/get_property";

  const requestBody = {
    status,
    offset,
    limit,
    role: role === null ? "researcher" : role,
    userid,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const json = await res.json();
  if (json.error) throw new Error(json.message || "API error");
  return json.data || [];
};

// Memoized user data fetch
const fetchUserData = async (userToken, userId) => {
  const userResponse = await fetch(
    `https://externalchecking.com/api/api_rone_new/public/api/get_user_by_id?userid=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
  const userData = await userResponse.json();

  if (userData.error) {
    throw new Error(userData.message || "Failed to fetch user data");
  }

  return userData.data;
};

export default function MyProperty() {
  const { t } = useTranslation();
  const { userToken, currentUser } = useStateContext();

  // State management
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});
  const [userRole, setUserRole] = useState(null);

  // Refs for cleanup
  const animationRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Constants
  const propertiesPerPage = 21;

  // Debounced filters to prevent excessive API calls
  const debouncedFilters = useDebounce(currentFilters, 300);

  // Memoized smooth scroll function
  const smoothScrollToTop = useCallback(() => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startPosition = window.pageYOffset;
    const targetPosition = 0;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);

      const easeInOutCubic =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * easeInOutCubic);

      if (timeElapsed < duration) {
        animationRef.current = requestAnimationFrame(animation);
      }
    };

    animationRef.current = requestAnimationFrame(animation);
  }, []);

  // Memoized filter function
  const applyFilters = useCallback((properties, filters) => {
    if (Object.keys(filters).length === 0) return properties;

    return properties.filter((property) => {
      // Filter by type/category
      if (
        filters.type &&
        (!property.category || property.category.category !== filters.type)
      ) {
        return false;
      }

      // Filter by price range
      if (filters.minPrice || filters.maxPrice) {
        const propertyPrice = parseInt(
          (property.price || "").toString().replace(/[^0-9]/g, "")
        );
        if (filters.minPrice && propertyPrice < filters.minPrice) return false;
        if (filters.maxPrice && propertyPrice > filters.maxPrice) return false;
      }

      // Filter by status
      if (
        filters.status !== undefined &&
        filters.status !== null &&
        property.status !== Number(filters.status)
      ) {
        return false;
      }

      // Filter by keyword
      if (filters.keyword) {
        const searchTerm = filters.keyword.toLowerCase();
        const searchableText = [
          property.title,
          property.address,
          property.type,
          property.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!searchableText.includes(searchTerm)) return false;
      }

      return true;
    });
  }, []);

  // Memoized filtered and sorted properties
  const filteredProperties = useMemo(() => {
    const filtered = applyFilters(allProperties, debouncedFilters);
    return filtered.sort((a, b) => b.id - a.id);
  }, [allProperties, debouncedFilters, applyFilters]);

  // Memoized paginated properties
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    return filteredProperties.slice(startIndex, endIndex);
  }, [filteredProperties, currentPage, propertiesPerPage]);

  // Memoized pagination data
  const paginationData = useMemo(() => {
    const totalProperties = filteredProperties.length;
    const totalPages = Math.max(
      1,
      Math.ceil(totalProperties / propertiesPerPage)
    );

    return {
      totalProperties,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [filteredProperties.length, currentPage, propertiesPerPage]);

  // Optimized page change handler
  const handlePageChange = useCallback(
    (page) => {
      if (
        page >= 1 &&
        page <= paginationData.totalPages &&
        page !== currentPage
      ) {
        setCurrentPage(page);
        smoothScrollToTop();
      }
    },
    [currentPage, paginationData.totalPages, smoothScrollToTop]
  );

  // Optimized filter handlers
  const handleFilterApply = useCallback(
    (filters) => {
      setCurrentPage(1);
      setCurrentFilters(filters);
      smoothScrollToTop();
    },
    [smoothScrollToTop]
  );

  const handleFilterClear = useCallback(() => {
    setCurrentPage(1);
    setCurrentFilters({});
    smoothScrollToTop();
  }, [smoothScrollToTop]);

  // Optimized view toggle
  const handleViewToggle = useCallback(
    (newView) => {
      if (newView !== view) {
        setView(newView);
      }
    },
    [view]
  );

  // Main data fetching effect
  useEffect(() => {
    if (!userToken || !currentUser?.id) return;

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Only fetch user data if we don't have the role cached
        let role = userRole;
        if (!role) {
          const userData = await fetchUserData(userToken, currentUser.id);
          role = userData.role;
          setUserRole(role);
        }

        // Fetch properties with optimized parallel requests
        const fetchPromises = [
          fetchMyProperties({
            userToken,
            role,
            userid: currentUser.id,
            status: 0,
            limit: role === "agency" ? 100 : 100,
          }),
          fetchMyProperties({
            userToken,
            role,
            userid: currentUser.id,
            status: 1,
            limit: role === "agency" ? 100 : 100,
          }),
        ];

        const [pending, active] = await Promise.all(fetchPromises);

        if (signal.aborted) return;

        // Combine and deduplicate
        const combined = [...pending, ...active];
        const deduplicated = combined.filter(
          (item, idx, arr) => arr.findIndex((i) => i.id === item.id) === idx
        );

        setAllProperties(deduplicated);
      } catch (err) {
        if (signal.aborted) return;

        console.error("Error fetching properties:", err);
        let errorMessage = err.message;
        if (errorMessage === "API error") {
          errorMessage = t("errors.api_error");
        } else if (errorMessage === "Failed to fetch user data") {
          errorMessage = t("errors.failed_to_fetch_user_data");
        } else if (!errorMessage) {
          errorMessage = t("errors.failed_to_fetch_properties");
        }
        setError(errorMessage);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [userToken, currentUser?.id, userRole, t]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoized pagination component
  const PaginationComponent = useMemo(() => {
    if (paginationData.totalPages <= 1) return null;

    const { totalPages } = paginationData;
    const pageNumbers = [];
    const maxPagesToShow = window.innerWidth < 768 ? 3 : 5;
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
          disabled={!paginationData.hasPrevPage}
          className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md transition-colors duration-200 ${
            !paginationData.hasPrevPage
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
          disabled={!paginationData.hasNextPage}
          className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md transition-colors duration-200 ${
            !paginationData.hasNextPage
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-800 text-white hover:bg-blue-900"
          }`}
        >
          {t("properties_page.pagination_next")}
        </button>
      </div>
    );
  }, [currentPage, paginationData, handlePageChange, t]);

  // Early returns for different states
  if (!userToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("my_property_page.login_required")}
          </h2>
          <p className="text-gray-600">{t("my_property_page.login_message")}</p>
        </div>
      </div>
    );
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
              <MyPropertyFilter
                onFilter={handleFilterApply}
                onClear={handleFilterClear}
              />
              <button
                onClick={() => handleViewToggle("grid")}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  view === "grid" ? "bg-blue-800 text-white" : "bg-gray-200"
                }`}
              >
                <Squares2X2Icon className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => handleViewToggle("list")}
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
        <MyPropertyFilter
          onFilter={handleFilterApply}
          onClear={handleFilterClear}
        />
        <div className="w-full max-w-6xl mx-auto py-4 md:py-5 md:px-10">
          <p className="text-red-600">
            {t("my_property_page.error_message", { error: error })}
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
            <MyPropertyFilter
              onFilter={handleFilterApply}
              onClear={handleFilterClear}
            />
            <button
              onClick={() => handleViewToggle("grid")}
              className={`p-2 rounded-md transition-colors duration-200 ${
                view === "grid" ? "bg-blue-800 text-white" : "bg-gray-200"
              }`}
            >
              <Squares2X2Icon className="w-4 h-4 md:w-6 md:h-6" />
            </button>
            <button
              onClick={() => handleViewToggle("list")}
              className={`p-2 rounded-md transition-colors duration-200 ${
                view === "list" ? "bg-blue-800 text-white" : "bg-gray-200"
              }`}
            >
              <ListBulletIcon className="w-4 h-4 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {filteredProperties.length === 0 && !loading && !error ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <MdApartment className="w-16 h-16 mb-4" />
            <p className="text-lg">{t("my_property_page.no_properties")}</p>
          </div>
        ) : (
          <>
            <div
              className={`grid ${
                view === "grid"
                  ? "grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 lg:grid-cols-2"
              } gap-4`}
            >
              {paginatedProperties.map((property) => (
                <div
                  key={property.id}
                  className="transition-transform duration-200"
                >
                  <MyPropertyCard property={property} view={view} />
                </div>
              ))}
            </div>
            {PaginationComponent}
          </>
        )}
      </div>
    </PageComponents>
  );
}
