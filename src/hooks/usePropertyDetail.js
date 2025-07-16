import { useCallback, useEffect, useState } from "react";
import { fetchPropertyById } from "../api/propertyApi";

export function usePropertyDetail(id, userToken, locationStateProperty) {
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // Helper to get property from sessionStorage if needed
  function getCachedProperty() {
    const cached = sessionStorage.getItem("lastViewedProperty");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  }

  const fetchPropertyDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      let propertyData = null;
      if (locationStateProperty) {
        propertyData = locationStateProperty;
      } else {
        const cached = getCachedProperty();
        if (cached && String(cached.id) === String(id)) {
          propertyData = cached;
        }
      }
      if (propertyData) {
        let normalizedCategory = propertyData.category;
        if (typeof normalizedCategory === "string" || !normalizedCategory) {
          normalizedCategory = {
            category: propertyData.category || "",
            image: propertyData.category_image || "",
          };
        }
        propertyData = {
          ...propertyData,
          title_image: propertyData.image || propertyData.title_image,
          description: propertyData.description || propertyData.descriptions || "",
          propery_type: propertyData.propery_type || propertyData.status,
          post_created: propertyData.post_created || propertyData.time || new Date().toISOString(),
          type: propertyData.type || "",
          status: propertyData.state || propertyData.status,
          price: propertyData.price ? parseFloat(String(propertyData.price).replace(/[^0-9.-]+/g, "")) || 0 : 0,
          gallery: propertyData.gallery || [],
          category: normalizedCategory,
        };
        setProperty(propertyData);
        setSelectedImage(propertyData.title_image);
        return;
      }
      // Fallback to API
      let apiProperty = null;
      try {
        apiProperty = await fetchPropertyById(id, userToken);
      } catch (err) {
        if (err.message && err.message.toLowerCase().includes("authorization token not found")) {
          apiProperty = await fetchPropertyById(id, null);
        } else {
          throw err;
        }
      }
      if (!apiProperty) throw new Error("Property not found");
      setProperty(apiProperty);
      setSelectedImage(apiProperty.title_image);
    } catch (error) {
      setError(error.message || "Failed to fetch property");
    } finally {
      setIsLoading(false);
    }
  }, [id, userToken, locationStateProperty]);

  useEffect(() => {
    fetchPropertyDetail();
    return () => {
      // Clear the cache on unmount
      sessionStorage.removeItem("lastViewedProperty");
    };
    // eslint-disable-next-line
  }, [id, userToken]);

  return { property, isLoading, error, selectedImage, setSelectedImage, fetchPropertyDetail };
} 