import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdApartment } from "react-icons/md";
import PageComponents from "../../components/PageComponents";
import MyPropertyFilter from "../../components/Properies/MyPropertyFilter";
import MyPropertyCard from "../../components/shared/MyPropertyCard";
import PropertyCardSkeleton from "../../components/shared/PropertyCardSkeleton";
import { useStateContext } from "../../contexts/ContextProvider";

async function fetchMyProperties({
  userToken,
  role,
  userid,
  status,
  offset = 0,
  limit = 100,
}) {
  const url =
    "https://externalchecking.com/api/api_rone_new/public/api/get_property";

  // Prepare request body
  const requestBody = {
    status,
    offset,
    limit,
    role: role === null ? "researcher" : role,
    userid,
  };

  console.log("API Request URL:", url);
  console.log("Request Body:", requestBody);

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
}

export default function MyProperty() {
  const { t } = useTranslation();
  const { userToken, currentUser } = useStateContext();
  const [Properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const propertiesPerPage = 21;
  const [currentFilters, setCurrentFilters] = useState({});

  // Smooth scroll utility function
  const smoothScrollToTop = () => {
    const startPosition = window.pageYOffset;
    const targetPosition = 0;
    const distance = targetPosition - startPosition;
    const duration = 800; // 800ms for smooth animation
    let start = null;

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function for smooth animation
      const easeInOutCubic =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startPosition + distance * easeInOutCubic);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      smoothScrollToTop(); // Use custom smooth scroll function
    }
  };

  const handleFilterApply = (filters) => {
    setCurrentPage(1);
    setCurrentFilters(filters);
    smoothScrollToTop(); // Add smooth scroll for filter apply
  };

  const handleFilterClear = () => {
    setCurrentPage(1);
    setCurrentFilters({});
    smoothScrollToTop(); // Add smooth scroll for filter clear
  };

  useEffect(() => {
    if (!userToken || !currentUser?.id) return;
    setLoading(true);
    setError(null);
    const fetchProps = async () => {
      try {
        // Fetch latest user data to get current role
        const userResponse = await fetch(
          `https://externalchecking.com/api/api_rone_new/public/api/get_user_by_id?userid=${currentUser.id}`,
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

        // Use the role from the latest user data
        let role = userData.data.role;
        let userid = currentUser.id;

        console.log("Latest user data:", userData.data);
        console.log("Fetching Properties for:", {
          role,
          userid,
          name: currentUser.name,
        });

        let allProperties = [];

        // For agency role, fetch all Properties with higher limit
        if (role === "agency") {
          const [pending, active] = await Promise.all([
            fetchMyProperties({
              userToken,
              role,
              userid,
              status: 0,
              limit: 100, // Increased limit for agency
            }),
            fetchMyProperties({
              userToken,
              role,
              userid,
              status: 1,
              limit: 100, // Increased limit for agency
            }),
          ]);
          allProperties = [...pending, ...active];
        } else {
          // For other roles (including null role), fetch with default limit
          const [pending, active] = await Promise.all([
            fetchMyProperties({
              userToken,
              role,
              userid,
              status: 0,
            }),
            fetchMyProperties({
              userToken,
              role,
              userid,
              status: 1,
            }),
          ]);
          allProperties = [...pending, ...active];
        }

        // Log the responses for debugging
        console.log("All Properties raw data:", allProperties);
        // Debug: log types of property.status and currentFilters.status
        if (allProperties.length > 0) {
          console.log(
            "Sample property.status:",
            allProperties[0].status,
            typeof allProperties[0].status
          );
          console.log(
            "Sample property.type:",
            allProperties[0].type,
            typeof allProperties[0].type
          );
        }
        console.log(
          "currentFilters.status:",
          currentFilters.status,
          typeof currentFilters.status
        );
        console.log(
          "currentFilters.type:",
          currentFilters.type,
          typeof currentFilters.type
        );
        // Deduplicate by id
        const combined = allProperties.filter(
          (item, idx, arr) => arr.findIndex((i) => i.id === item.id) === idx
        );

        // Sort Properties by ID in descending order
        const sortedProperties = combined.sort((a, b) => b.id - a.id);

        // Apply filters if any exist
        const filteredProperties = sortedProperties.filter((property) => {
          if (Object.keys(currentFilters).length === 0) return true;

          // Filter by type/category if specified
          if (
            currentFilters.type &&
            (!property.category ||
              property.category.category !== currentFilters.type)
          ) {
            return false;
          }

          // Filter by price range if specified
          if (currentFilters.minPrice) {
            const propertyPrice = parseInt(
              (property.price || "").toString().replace(/[^0-9]/g, "")
            );
            if (propertyPrice < currentFilters.minPrice) return false;
          }
          if (currentFilters.maxPrice) {
            const propertyPrice = parseInt(
              (property.price || "").toString().replace(/[^0-9]/g, "")
            );
            if (propertyPrice > currentFilters.maxPrice) return false;
          }

          // Filter by status if specified
          if (
            currentFilters.status !== undefined &&
            currentFilters.status !== null &&
            property.status !== Number(currentFilters.status)
          ) {
            return false;
          }

          // Filter by keyword if specified
          if (currentFilters.keyword) {
            const searchTerm = currentFilters.keyword.toLowerCase();
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

        setProperties(filteredProperties);
        setTotalProperties(filteredProperties.length);
      } catch (err) {
        console.error("Error fetching Properties:", err);
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
        setLoading(false);
      }
    };
    fetchProps();
  }, [userToken, currentUser, currentFilters, t]);

  const totalPages = Math.max(
    1,
    Math.ceil(totalProperties / propertiesPerPage)
  );

  const renderPagination = () => {
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
        <div className="w-full max-w-7xl mx-auto py-4 md:py-5 lg:px-10">
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
      <div className="w-full max-w-7xl mx-auto py-4 md:py-5 lg:px-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md md:text-2xl">{t("properties_page.title")}</h2>
          <div className="flex items-center gap-2">
            <MyPropertyFilter
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
            <p className="text-lg">{t("my_property_page.no_properties")}</p>
          </div>
        ) : (
          <div
            className={`grid ${
              view === "grid"
                ? "grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 lg:grid-cols-2"
            } gap-4`}
          >
            {Properties.slice(
              (currentPage - 1) * propertiesPerPage,
              currentPage * propertiesPerPage
            ).map((property) => (
              <div
                key={property.id}
                className="transition-transform duration-200 "
              >
                <MyPropertyCard property={property} view={view} />
              </div>
            ))}
          </div>
        )}
        {totalPages > 1 && Properties.length > 0 && renderPagination()}
      </div>
    </PageComponents>
  );
}
