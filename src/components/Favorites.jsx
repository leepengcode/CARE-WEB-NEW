import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { fetchAllProperties } from "../api/propertyApi";
import { useStateContext } from "../contexts/ContextProvider";
import LoginPrompt from "./LoginPrompt";
import PageComponents from "./PageComponents";
import PropertyFilters from "./Properies/PropertyFilters";
import PropertyCard from "./shared/PropertyCard";
import PropertyCardSkeleton from "./shared/PropertyCardSkeleton";

const Favorites = () => {
  const { userToken, currentUser } = useStateContext();
  const [allFavorites, setAllFavorites] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [error, setError] = useState(null);
  const [_, setCurrentFilters] = useState({});

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
        const favs = data
          .filter(
            (property) =>
              Array.isArray(property.favourite_users) &&
              property.favourite_users.includes(currentUser.id)
          )
          .map((property) => ({
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
            is_favourite: 1,
          }));
        setAllFavorites(favs);
        setFavorites(favs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch favorites");
        setLoading(false);
      });
  }, [userToken, currentUser?.id]);

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

  if (!userToken) {
    return <LoginPrompt />;
  }

  if (loading) {
    return (
      <PageComponents>
        <div className="w-full max-w-6xl mx-auto py-4 md:py-5 lg:px-10">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md md:text-xl">Favorites</h2>
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
            {Array.from({ length: 12 }).map((_, i) => (
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
        <div className="w-full max-w-6xl mx-auto py-4 md:py-5 lg:px-10">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-md md:text-xl">Favorites</h2>
          </div>
          <p className="text-red-500">{error}</p>
        </div>
      </PageComponents>
    );
  }

  return (
    <PageComponents>
      <div className="w-full max-w-6xl mx-auto py-4 md:py-5 lg:px-10">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md md:text-2xl">Favorites</h2>
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
        {favorites.length === 0 ? (
          <div className="text-gray-500 p-4">No favorite properties found.</div>
        ) : (
          <div
            className={`grid ${
              view === "grid"
                ? "grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 lg:grid-cols-2"
            } gap-4`}
          >
            {favorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                view={view}
                onFavoriteChange={(id, isFav) => {
                  if (!isFav) {
                    setFavorites((prev) => prev.filter((p) => p.id !== id));
                    setAllFavorites((prev) => prev.filter((p) => p.id !== id));
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </PageComponents>
  );
};

export default Favorites;
