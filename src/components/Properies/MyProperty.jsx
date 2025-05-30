import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import LoginPrompt from "../LoginPrompt";
import PageComponents from "../PageComponents";
import PropertyCard from "../shared/PropertyCard";
import PropertyCardSkeleton from "../shared/PropertyCardSkeleton";
import PropertyFilters from "./PropertyFilters";

async function fetchMyProperties({ userToken, role, userid, status }) {
  const url = "http://127.0.0.1:8000/api/get_property";
  const params = new URLSearchParams({
    role,
    userid,
    status,
    limit: 1000,
    offset: 0,
  });
  const res = await fetch(`${url}?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
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
  const propertiesPerPage = 12;
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
        let role = currentUser.role || "user";
        let userid = currentUser.id;
        // Fetch status=0 (pending)
        const pending = await fetchMyProperties({
          userToken,
          role,
          userid,
          status: 0,
        });
        // Fetch status=1 (active)
        const active = await fetchMyProperties({
          userToken,
          role,
          userid,
          status: 1,
        });
        // Combine and deduplicate by id
        const combined = [...pending, ...active].filter(
          (item, idx, arr) => arr.findIndex((i) => i.id === item.id) === idx
        );
        // Map to PropertyCard format
        const mapped = combined.map((property) => ({
          id: property.id,
          image: property.title_image,
          status: property.propery_type,
          type: property.category?.category,
          category: property.category?.image,
          price: `$${
            property.price?.toLocaleString?.() ?? property.price ?? 0
          }`,
          title: property.title,
          location: property.address,
          views: property.total_view,
          time: property.post_created,
          is_favourite: property.is_favourite,
        }));

        // Apply filters if any exist
        const filteredProperties = mapped.filter((property) => {
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
            property.propery_type !== currentFilters.status
          ) {
            return false;
          }

          return true;
        });

        setProperties(filteredProperties);
        setTotalProperties(filteredProperties.length);
      } catch (err) {
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

  if (!userToken) return <LoginPrompt />;

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-8 px-2 md:px-10">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-md md:text-2xl">My Property</h1>
          <div className="flex gap-2 items-center">
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
        {loading ? (
          <div
            className={`grid ${
              view === "grid"
                ? "grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 lg:grid-cols-2"
            } gap-4`}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <PropertyCardSkeleton key={i} view={view} />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : properties.length === 0 ? (
          <div className="text-gray-500 p-4">No properties found.</div>
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
                <PropertyCard
                  key={property.id}
                  property={property}
                  view={view}
                />
              ))}
          </div>
        )}
        {totalPages > 1 && renderPagination()}
      </div>
    </PageComponents>
  );
}
