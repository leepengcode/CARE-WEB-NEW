import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdApartment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { fetchAllProperties } from "../../api/propertyApi";
import PageComponents from "../../components/PageComponents";
import CategoryPropertyFilter from "../../components/Properies/CategoryPropertyFilter";
import PropertyCard from "../../components/shared/PropertyCard";
import PropertyCardSkeleton from "../../components/shared/PropertyCardSkeleton";

export default function CategoryProperties({ category, title, image }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [view, setView] = useState("grid");
  const [Properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const propertiesPerPage = 24;
  const [currentFilters, setCurrentFilters] = useState({});

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [category, currentPage, currentFilters]);

  const fetchData = useCallback(
    async (filters = currentFilters, page = currentPage) => {
      setLoading(true);
      try {
        // Remove null/undefined values from filters and remove category from filters
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(
            ([key, value]) => value != null && key !== "category"
          )
        );

        const { data = [], total } = await fetchAllProperties(
          page,
          propertiesPerPage,
          { ...cleanFilters, category }
        );

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format from server");
        }

        const filteredProperties = data.filter(
          (property) =>
            property.status === 1 && property.category?.category === category
        );

        setProperties(filteredProperties);
        setTotalProperties(total);
        setError(null);
      } catch (err) {
        setError(
          err.message || "Failed to fetch Properties. Please try again."
        );
        setProperties([]);
        setTotalProperties(0);
      } finally {
        setLoading(false);
      }
    },
    [category, currentFilters, propertiesPerPage]
  ); // Added dependencies

  const handlePropertyClick = (property) => {
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
    navigate(`/property/${property.id}`, { state: { property } });
  };

  const totalPages = Math.ceil(totalProperties / propertiesPerPage);

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
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md ${
            currentPage === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-800 text-white hover:bg-blue-900"
          }`}
        >
          {t("category_properties_page.pagination_prev")}
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
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
            onClick={() => setCurrentPage(page)}
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
              onClick={() => setCurrentPage(totalPages)}
              className="px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md bg-gray-200 hover:bg-gray-300"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-base rounded-md ${
            currentPage === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-blue-800 text-white hover:bg-blue-900"
          }`}
        >
          {t("category_properties_page.pagination_next")}
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <PageComponents>
        <div className="w-full max-w-7xl mx-auto py-4 md:py-5 lg:px-10">
          <div className="relative w-full h-[15vh] md:h-[40vh] mb-6">
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">
                {title}
              </h1>
            </div>
          </div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md md:text-xl">
              {t("category_properties_page.all_properties")}
            </h2>
            <div className="flex items-center gap-2">
              <CategoryPropertyFilter
                onFilter={setCurrentFilters}
                onClear={() => setCurrentFilters({})}
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
        <CategoryPropertyFilter
          onFilter={setCurrentFilters}
          onClear={() => setCurrentFilters({})}
        />
        <div className="w-full max-w-7xl mx-auto py-4 md:py-5 md:px-10">
          <p className="text-red-600">
            {t("category_properties_page.error_message", { error })}
          </p>
        </div>
      </PageComponents>
    );
  }

  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-4 md:py-5 lg:px-10">
        <div className="relative w-full h-[15vh] md:h-[40vh] mb-6">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg">
              {title}
            </h1>
          </div>
        </div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md md:text-2xl">
            {t("category_properties_page.all_properties")}
          </h2>
          <div className="flex items-center gap-2">
            <CategoryPropertyFilter
              onFilter={setCurrentFilters}
              onClear={() => setCurrentFilters({})}
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
        {Properties.length === 0 && !loading && !error ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <MdApartment className="w-16 h-16 mb-4" />
            <p className="text-lg">
              {t("category_properties_page.no_properties")}
            </p>
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
              <div onClick={() => handlePropertyClick(property)}>
                <PropertyCard
                  property={{
                    ...property,
                    image: property.title_image,
                    status: property.propery_type,
                    price: `$${
                      property.price?.toLocaleString?.() ?? property.price ?? 0
                    }`,
                    location: property.address,
                    views: property.total_view,
                    time: property.post_created,
                  }}
                  view={view}
                />
              </div>
            ))}
          </div>
        )}
        {totalPages > 1 && Properties.length > 0 && renderPagination()}
      </div>
    </PageComponents>
  );
}
