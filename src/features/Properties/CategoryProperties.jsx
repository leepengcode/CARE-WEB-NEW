import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { MdApartment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PageComponents from "../../components/PageComponents";
import CategoryPropertyFilter from "../../components/Properies/CategoryPropertyFilter";
import PropertyCard from "../../components/shared/PropertyCard";
import PropertyCardSkeleton from "../../components/shared/PropertyCardSkeleton";
import { useCategoryProperties } from "../../hooks/useCategoryProperties";

export default function CategoryProperties({ category, title, image }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    view,
    setView,
    Properties,
    loading,
    error,
    currentPage,
    setCurrentPage,
    setCurrentFilters,
    totalPages,
    handlePropertyClick,
  } = useCategoryProperties(category);

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

  if (error) {
    // Don't render anything, useEffect will navigate back
    return null;
  }
  if (loading) {
    return (
      <PageComponents>
        <div className="w-full max-w-7xl mx-auto py-4 md:py-1 lg:px-18">
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
            {Array.from({ length: 24 }).map((_, i) => (
              <PropertyCardSkeleton key={i} view={view} />
            ))}
          </div>
        </div>
      </PageComponents>
    );
  }

  return (
    <PageComponents>
      <div className="w-full max-w-7xl mx-auto py-4 md:py-1 lg:px-18">
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
              <div
                key={property.id}
                onClick={() => handlePropertyClick(property, navigate)}
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
