import { useEffect, useState } from "react";
import { toggleFavorite } from "../api/propertyApi";

export function useFavoriteProperty(propertyId, userToken, showToast) {
  const [favLoading, setFavLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);

  function getFavoriteIds() {
    try {
      return JSON.parse(localStorage.getItem("favoritePropertyIds") || "[]");
    } catch {
      return [];
    }
  }
  function setFavoriteIds(ids) {
    localStorage.setItem("favoritePropertyIds", JSON.stringify(ids));
  }

  useEffect(() => {
    if (propertyId) {
      const favIds = getFavoriteIds();
      setIsFav(favIds.includes(propertyId));
    }
  }, [propertyId]);

  const handleToggleFavorite = async () => {
    if (!userToken) {
      showToast && showToast("Please log in to use favorites.", "error");
      return;
    }
    if (!propertyId || favLoading) return;
    setFavLoading(true);
    const type = isFav ? 0 : 1;
    try {
      const res = await toggleFavorite(propertyId, type, userToken);
      if (!res.error) {
        let favIds = getFavoriteIds();
        if (type === 1) {
          favIds = [...new Set([...favIds, propertyId])];
          showToast && showToast("Added to favorites!", "success");
        } else {
          favIds = favIds.filter((id) => id !== propertyId);
          showToast && showToast("Removed from favorites!", "success");
        }
        setFavoriteIds(favIds);
        setIsFav(type === 1);
      }
    } catch {
      showToast && showToast("Failed to update favorite status.", "error");
    } finally {
      setFavLoading(false);
    }
  };

  return { isFav, favLoading, handleToggleFavorite };
} 