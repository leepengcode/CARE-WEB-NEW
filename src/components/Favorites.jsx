import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchAllProperties } from "../api/propertyApi";
import { useStateContext } from "../contexts/ContextProvider";
import PropertyFilters from "../features/Properties/PropertyFilters";
import PageComponents from "./PageComponents";
import PropertyCard from "./shared/PropertyCard";
import PropertyCardSkeleton from "./shared/PropertyCardSkeleton";

const Favorites = () => {
  const { t } = useTranslation();
  const { userToken, currentUser } = useStateContext();
  const [allFavorites, setAllFavorites] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [error, setError] = useState(null);
  const [_, setCurrentFilters] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (!userToken || !currentUser?.id) {
      setAllFavorites([]);
      setFavorites([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchAllProperties(1, 1000)
      .then(({ data }) => {
        const favs = data.filter(
          (property) =>
            Array.isArray(property.favourite_users) &&
            property.favourite_users.includes(currentUser.id)
        );
        setAllFavorites(favs);
        setFavorites(favs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || t("favorite.error"));
        setLoading(false);
      });
  }, [userToken, currentUser?.id, t]);

  const handleFilterApply = (filters) => {
    setCurrentFilters(filters);
    let filtered = allFavorites;
    if (filters.type) {
      filtered = filtered.filter(
        (p) => p.status?.toLowerCase() === filters.type
      );
    }
    if (filters.category) {
      filtered = filtered.filter((p) => p.type === filters.category);
    }
    if (filters.city) {
      filtered = filtered.filter((p) => p.location?.includes(filters.city));
    }
    if (filters.minPrice) {
      filtered = filtered.filter(
        (p) => parseFloat(p.price.replace(/[^\d.]/g, "")) >= filters.minPrice
      );
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(
        (p) => parseFloat(p.price.replace(/[^\d.]/g, "")) <= filters.maxPrice
      );
    }
    if (filters.keyword) {
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          p.location?.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }
    setFavorites(filtered);
  };

  const handleFilterClear = () => {
    setCurrentFilters({});
    setFavorites(allFavorites);
  };

  return (
    <PageComponents>
      {/* Hero Section (always show) */}

      {/* Content below hero section */}
      {!userToken ? (
        <div className="w-full max-w-7xl mx-auto py-10 flex flex-col items-center justify-center min-h-[300px]">
          {/* Hero Section */}
          <div className="relative mt-5 md:mt-0 w-full h-[140px] md:h-[200px] rounded-2xl overflow-hidden mb-8 flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <FaRegHeart className="text-blue-200 text-5xl md:text-7xl opacity-30" />
            </div>
            <div className="relative z-10 text-center">
              <h1 className="text-2xl md:text-4xl font-bold text-blue-900 mb-2 drop-shadow-lg">
                {t("favorite.title")}
              </h1>
              <p className="text-blue-800 text-base md:text-lg font-medium max-w-2xl mx-auto">
                {t("favorite.subtitle")}
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            {t("favorite.login_required")}
          </h2>
          <p className="text-gray-600 text-lg">{t("favorite.login_message")}</p>
        </div>
      ) : loading ? (
        <div className="w-full max-w-7xl mx-auto py-4 md:py-5 lg:px-10">
          {/* Hero Section */}
          <div
            className={`relative pt-10 pb-16 transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl mb-8 animate-pulse-slow">
                <FaRegHeart className="text-white text-3xl" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent p-3 mb-6 leading-tight">
                {t("favorite.title")}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("favorite.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md md:text-xl">{t("favorite.title")}</h2>
            <div className="flex gap-2 items-center">
              <PropertyFilters
                onApply={handleFilterApply}
                onClear={handleFilterClear}
              />
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-md ${
                  view === "grid" ? "bg-blue-800 text-white" : "bg-gray-200"
                }`}
                title={t("favorite.grid")}
              >
                <Squares2X2Icon className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md ${
                  view === "list" ? "bg-blue-800 text-white" : "bg-gray-200"
                }`}
                title={t("favorite.list")}
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
            {Array.from({ length: 12 }).map((_, i) => (
              <PropertyCardSkeleton key={i} view={view} />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="w-full max-w-7xl mx-auto py-4 md:py-5 lg:px-10">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md md:text-xl">{t("favorite.title")}</h2>
          </div>
          <p className="text-red-500">{t("favorite.error")}</p>
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto py-4 md:py-5 lg:px-10">
          {/* Hero Section */}
          {/* <div className="relative mt-5 md:mt-0 w-full h-[140px] md:h-[200px] rounded-2xl overflow-hidden mb-8 flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 shadow-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <FaRegHeart className="text-blue-200 text-5xl md:text-7xl opacity-30" />
            </div>
            <div className="relative z-10 text-center">
              <h1 className="text-2xl md:text-4xl font-bold text-blue-900 mb-2 drop-shadow-lg">
                {t("favorite.title")}
              </h1>
              <p className="text-blue-800 text-base md:text-lg font-medium max-w-2xl mx-auto">
                {t("favorite.subtitle")}
              </p>
            </div>
          </div> */}
          <div
            className={`relative pt-10 pb-16 transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-xl mb-8 animate-pulse-slow">
                <FaRegHeart className="text-white text-3xl" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent p-3 mb-6 leading-tight">
                {t("favorite.title")}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t("favorite.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md md:text-2xl">{t("favorite.title")}</h2>
            <div className="flex gap-2 items-center">
              <PropertyFilters
                onApply={handleFilterApply}
                onClear={handleFilterClear}
              />
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-md ${
                  view === "grid" ? "bg-blue-800 text-white" : "bg-gray-200"
                }`}
                title={t("favorite.grid")}
              >
                <Squares2X2Icon className="w-4 h-4 md:w-6 md:h-6" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md ${
                  view === "list" ? "bg-blue-800 text-white" : "bg-gray-200"
                }`}
                title={t("favorite.list")}
              >
                <ListBulletIcon className="w-4 h-4 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
          {favorites.length === 0 ? (
            <div className="text-gray-500 p-4">
              {t("favorite.no_favorites")}
            </div>
          ) : (
            <div
              className={`grid ${
                view === "grid"
                  ? "grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 lg:grid-cols-2"
              } gap-4`}
            >
              {favorites.map((property) => (
                <div
                  key={property.id}
                  onClick={() =>
                    navigate(`/property/${property.id}`, {
                      state: { property },
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  <PropertyCard
                    property={property}
                    view={view}
                    onFavoriteChange={(id, isFav) => {
                      if (!isFav) {
                        setFavorites((prev) => prev.filter((p) => p.id !== id));
                        setAllFavorites((prev) =>
                          prev.filter((p) => p.id !== id)
                        );
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PageComponents>
  );
};

export default Favorites;
