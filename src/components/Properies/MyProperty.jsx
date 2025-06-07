import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { MdApartment } from "react-icons/md";
import { useStateContext } from "../../contexts/ContextProvider";
import LoginPrompt from "../LoginPrompt";
import PageComponents from "../PageComponents";
import MyPropertyCard from "../shared/MyPropertyCard";
import PropertyCardSkeleton from "../shared/PropertyCardSkeleton";
import MyPropertyFilter from "./MyPropertyFilter";

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
  const { userToken, currentUser } = useStateContext();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const propertiesPerPage = 21;
  const [currentFilters, setCurrentFilters] = useState({});

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterApply = (filters) => {
    setCurrentPage(1);
    setCurrentFilters(filters);
  };

  const handleFilterClear = () => {
    setCurrentPage(1);
    setCurrentFilters({});
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
        console.log("Fetching properties for:", {
          role,
          userid,
          name: currentUser.name,
        });

        let allProperties = [];

        // For agency role, fetch all properties with higher limit
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
        console.log("All properties raw data:", allProperties);

        // Deduplicate by id
        const combined = allProperties.filter(
          (item, idx, arr) => arr.findIndex((i) => i.id === item.id) === idx
        );

        // Map to PropertyCard format
        const mapped = combined.map((property) => ({
          id: property.id,
          image: property.title_image || property.image,
          status: property.propery_type,
          state: property.status ? property.status.toString() : "",

          category: property.category?.category,
          category_image: property.category?.image || property.category,
          price: property.price
            ? parseFloat(String(property.price).replace(/[^0-9.-]+/g, "")) || 0
            : 0,
          title: property.title,
          location: property.address,
          views: property.total_view,
          time: property.post_created || property.time,
          is_favourite: property.is_favourite,
          gallery: property.gallery || [],
          description: property.description || property.descriptions || "",
          propery_type: property.propery_type || property.status,
          post_created: property.post_created || property.time,
          agent_owner: property.agent_owner || null,
          mobile: property.mobile || null,
          telegram_link: property.telegram_link || null,
        }));

        // Sort properties by ID in descending order
        const sortedProperties = mapped.sort((a, b) => b.id - a.id);

        // Apply filters if any exist
        const filteredProperties = sortedProperties.filter((property) => {
          if (Object.keys(currentFilters).length === 0) return true;

          // Filter by type/category if specified
          if (currentFilters.type && property.type !== currentFilters.type) {
            return false;
          }

          // Filter by price range if specified
          if (currentFilters.minPrice) {
            const propertyPrice = parseInt(
              property.price.replace(/[^0-9]/g, "")
            );
            if (propertyPrice < currentFilters.minPrice) return false;
          }
          if (currentFilters.maxPrice) {
            const propertyPrice = parseInt(
              property.price.replace(/[^0-9]/g, "")
            );
            if (propertyPrice > currentFilters.maxPrice) return false;
          }

          // Filter by status if specified
          if (
            currentFilters.status !== undefined &&
            currentFilters.status !== null &&
            property.state !== currentFilters.status
          ) {
            return false;
          }

          // Filter by keyword if specified
          if (currentFilters.keyword) {
            const searchTerm = currentFilters.keyword.toLowerCase();
            const searchableText = [
              property.title,
              property.location,
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
        console.error("Error fetching properties:", err);
        setError(err.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProps();
  }, [userToken, currentUser, currentFilters]);

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

  if (!userToken) {
    return <LoginPrompt message="Please log in to view your properties." />;
  }

  if (loading) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-4 md:py-5 lg:px-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 mt-5 gap-3 md:gap-0">
            <h2 className="text-md md:text-xl">My Properties</h2>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <MyPropertyFilter
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
        <MyPropertyFilter
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 mt-5 gap-3 md:gap-0">
          <h2 className="text-md md:text-2xl">My Properties</h2>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <MyPropertyFilter
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

        {properties.length === 0 && !loading && !error ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <MdApartment className="w-16 h-16 mb-4" />
            <p className="text-lg">No properties available in your list.</p>
          </div>
        ) : (
          <div
            className={`grid ${
              view === "grid"
                ? "grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 lg:grid-cols-2"
            } gap-4`}
          >
            {properties
              .slice(
                (currentPage - 1) * propertiesPerPage,
                currentPage * propertiesPerPage
              )
              .map((property) => (
                <MyPropertyCard
                  key={property.id}
                  property={property}
                  view={view}
                />
              ))}
          </div>
        )}
        {totalPages > 1 && properties.length > 0 && renderPagination()}
      </div>
    </PageComponents>
  );
}
