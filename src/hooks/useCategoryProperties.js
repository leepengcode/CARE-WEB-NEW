import { useCallback, useEffect, useState } from "react";
import { fetchAllProperties } from "../api/propertyApi";

export function useCategoryProperties(category, propertiesPerPage = 24) {
  const [view, setView] = useState("grid");
  const [Properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const [currentFilters, setCurrentFilters] = useState({});

  const fetchData = useCallback(
    async (filters = currentFilters, page = currentPage) => {
      setLoading(true);
      try {
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
          (property) => property.status === 1 && property.category?.category === category
        );
        setProperties(filteredProperties);
        setTotalProperties(total);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch Properties. Please try again.");
        setProperties([]);
        setTotalProperties(0);
      } finally {
        setLoading(false);
      }
    },
    [category, currentFilters, propertiesPerPage]
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [category, currentPage, currentFilters]);

  const totalPages = Math.ceil(totalProperties / propertiesPerPage);

  const handlePropertyClick = (property, navigate) => {
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

  return {
    view,
    setView,
    Properties,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalProperties,
    currentFilters,
    setCurrentFilters,
    totalPages,
    handlePropertyClick,
  };
} 